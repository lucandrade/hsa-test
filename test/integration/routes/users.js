import mongoose from 'mongoose';

describe('Routes Users', () => {
    const User = app.datasource.models.User;
    const userId = mongoose.Types.ObjectId();
    const defaultUser = {
        _id: userId,
        name: 'Defaut user',
        email: 'teste@teste.com',
        password: 'teste',
    };
    let token;
    beforeEach(done => {
        User
            .remove({})
            .then(() => User.create(defaultUser))
            .then(user => {
                token = jwt.encode({
                    id: user._id,
                    email: user.email,
                }, app.config.jwt.secret);
                done();
            });
    });

    describe('Route POST /v1/auth', () => {
        it('should authenticate the user', done => {
            const authorization = {
                username: defaultUser.email,
                password: defaultUser.password,
            };

            request
                .post('/v1/auth')
                .send(authorization)
                .end((err, res) => {
                    assert(res.body.token.indexOf('JWT ') >= 0, 'is ok');
                    done(err);
                });
        });
    });

    describe('Route GET /v1/me', () => {
        it('should return status code 401', done => {
            request
                .get('/v1/me')
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(401);
                    done(err);
                });
        });

        it('should return logged user', done => {
            request
                .get('/v1/me')
                .set('Authorization', `JWT ${token}`)
                .end((err, res) => {
                    expect(res.body.id).to.be.equal(defaultUser._id.toString());
                    expect(res.body.name).to.be.equal(defaultUser.name);
                    done(err);
                });
        });
    });

    describe('Route POST /v1/users', () => {
        it('should create a user', done => {
            const newUser = {
                _id: mongoose.Types.ObjectId(),
                name: 'newUser',
                password: 'senha',
                email: 'email@email.com',
            };

            request
                .post('/v1/users')
                .set('Authorization', `JWT ${token}`)
                .send(newUser)
                .end((err, res) => {
                    expect(res.body.id).to.be.equal(newUser._id.toString());
                    expect(res.body.name).to.be.equal(newUser.name);
                    done(err);
                });
        });
    });

    describe('Route PUT /v1/me', () => {
        it('should update a user', done => {
            defaultUser.name = 'Teste';
            request
                .put('/v1/me')
                .set('Authorization', `JWT ${token}`)
                .send(defaultUser)
                .end((err, res) => {
                    expect(res.body.id).to.be.equal(defaultUser._id.toString());
                    expect(res.body.name).to.be.equal(defaultUser.name);
                    done(err);
                });
        });
    });
});
