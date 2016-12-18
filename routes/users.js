import express from 'express';
import HttStatus from 'http-status';
import UsersController from '../controllers/UsersController';

const router = express.Router();

export default app => {
    const controller = new UsersController(app);
    router.post('/auth', (req, res) => {
        controller.login(req.body.username, req.body.password)
            .then(result => {
                res.status(result.statusCode)
                    .send(result.data);
            });
    });

    router.route('/me')
        .all(app.auth.authenticate())
        .get((req, res) => {
            if (req.user) {
                controller.setUser(req.user)
                    .me()
                    .then(result => {
                        res.status(result.statusCode)
                            .send(result.data);
                    });
            } else {
                res.sendStatus(HttStatus.UNAUTHORIZED);
            }
        });

    router.route('/users')
        .all(app.auth.authenticate())
        .post((req, res) => {
            controller.create(req.body)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        })
        .get((req, res) => {
            controller.getAll()
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        });

    router.route('/users/:id')
        .all(app.auth.authenticate())
        .get((req, res) => {
            controller.getById(req.params.id)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        })
        .put((req, res) => {
            controller.update(req.params.id, req.body)
                .then(result => {
                    res.status(result.statusCode)
                        .send(result.data);
                });
        })
        .delete((req, res) => {
            controller.delete(req.params.id)
                .then(result => res.sendStatus(result.statusCode));
        });

    return router;
};
