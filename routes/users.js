import express from 'express';
import HttStatus from 'http-status';
import UsersController from '../controllers/UsersController';
import NotesController from '../controllers/NotesController';

const router = express.Router();

export default app => {
    const userController = new UsersController(app);
    const noteController = new NotesController(app);
    router.post('/auth', (req, res) => {
        userController.login(req.body.username, req.body.password)
            .then(result => {
                res.status(result.statusCode)
                    .send(result.data);
            });
    });

    router.put('/users/forgot-passoword', (req, res) => {
        if (req.body.email) {
            userController.forgotPassoword(req.body.email)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                })
                .catch(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        } else {
            res.send({
                message: 'Invalid body data',
            });
        }
    });

    router.put('/users/reset-passoword', (req, res) => {
        if (req.body.token && req.body.password) {
            userController.resetPassword(req.body.token, req.body.password)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                })
                .catch(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        } else {
            res.send({
                message: 'Invalid body data',
            });
        }
    });

    router.route('/users')
        .post((req, res) => {
            userController.create(req.body)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        });

    router.route('/me')
        .all(app.auth.authenticate())
        .get((req, res) => {
            if (req.user) {
                userController.setUser(req.user)
                    .me()
                    .then(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    });
            } else {
                res.sendStatus(HttStatus.UNAUTHORIZED);
            }
        })
        .put((req, res) => {
            userController.update(req.user.id, req.body)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        });

    router.route('/me/notes')
        .all(app.auth.authenticate())
        .post((req, res) => {
            if (req.body.text) {
                noteController
                    .setUser(req.user)
                    .create(req.body.text)
                    .then(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    })
                    .catch(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    });
            } else {
                res.send({
                    message: 'Invalid body data',
                });
            }
        })
        .get((req, res) => {
            noteController
                .setUser(req.user)
                .get()
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                })
                .catch(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        });

    router.route('/me/notes/:id')
        .all(app.auth.authenticate())
        .put((req, res) => {
            if (req.body.text) {
                noteController
                    .setUser(req.user)
                    .update(req.params.id, req.body.text)
                    .then(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    })
                    .catch(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    });
            } else {
                res.send({
                    message: 'Invalid body data',
                });
            }
        })
        .delete((req, res) => {
            noteController
                .setUser(req.user)
                .delete(req.params.id)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                })
                .catch(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        });

    return router;
};
