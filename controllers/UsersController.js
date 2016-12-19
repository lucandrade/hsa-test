import Sendgrid from 'sendgrid';
import HttStatus from 'http-status';
import jwt from 'jwt-simple';
import uuid from 'uuid';
import config from '../config/app';
import response from '../config/response';

export default class UsersController {
    constructor(app) {
        this.app = app;
        this.model = app.datasource.models.User;
        this.user = null;
    }

    setUser(user) {
        this.user = user;
        return this;
    }

    me() {
        return this.getById(this.user.id);
    }

    login(username, pass) {
        return this.model.findOne({
            email: username,
        })
        .then(user => {
            if (user && user.comparePassword(pass)) {
                const payload = {
                    id: user._id,
                    email: user.email,
                };
                return response.success({
                    token: `JWT ${jwt.encode(payload, config.jwt.secret)}`,
                    user,
                });
            }

            return response.error(new Error(HttStatus['401']), HttStatus.UNAUTHORIZED);
        });
    }

    getById(id) {
        return this.model.findById(id)
            .then(res => response.success(res))
            .catch(err => response.error(err));
    }

    create(data) {
        return this.model.create(data)
            .then(res => response.success(res, HttStatus.CREATED))
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    update(id, data) {
        return this.model.findByIdAndUpdate(id, {
            $set: data,
        })
            .then(() => this.model.findById(id))
            .then(res => {
                if (res) {
                    return response.success(res);
                }

                return response.error(new Error('Error updating user'), HttStatus.UNPROCESSABLE_ENTITY);
            })
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    delete(id) {
        return this.model.remove({
            _id: id,
        })
            .then(() => response.success('', HttStatus.NO_CONTENT))
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    forgotPassoword(email) {
        return this.model.findOne({
            email,
        })
        .then(user => {
            if (user) {
                return user;
            }

            throw new Error('Email not found');
        })
        .then(user => {
            const recoverToken = uuid.v4();
            return this.model.findByIdAndUpdate(user._id, {
                $set: {
                    recoverToken,
                },
            });
        })
        .then(updated => {
            if (!updated) {
                throw new Error('Error updating user');
            }

            return this.model.findById(updated._id);
        })
        .then(user => {
            if (!user) {
                throw new Error('Error updating user');
            }

            this.user = user;

            return this.sendForgotPasswordEmail(user);
        })
        .then(() => response.success({
            token: this.user.recoverToken,
        }))
        .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    sendForgotPasswordEmail(user) {
        const me = this;
        const sg = Sendgrid(me.app.config.email.key);
        const request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                personalizations: [{
                    to: [{
                        email: user.email,
                    }],
                    substitutions: {
                        '{token}': user.recoverToken,
                    },
                    subject: 'Reset password request',
                }],
                from: {
                    email: 'api@hsa.com',
                },
                template_id: me.app.config.email.template,
            },
        });
        return sg.API(request);
    }

    resetPassword(token, password) {
        return this.model.findOne({
            recoverToken: token,
        })
        .then(us => {
            if (us) {
                return us;
            }

            throw new Error('User not found');
        })
        .then(us => {
            const user = us;
            user.recoverToken = '';
            user.password = password;
            return user.save();
        })
        .then(updated => {
            if (updated) {
                return response.success({
                    message: 'The user password was updated',
                });
            }

            throw new Error('Error updating password');
        })
        .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }
}
