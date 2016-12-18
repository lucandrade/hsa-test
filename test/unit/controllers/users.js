import UsersController from '../../../controllers/UsersController';

describe('Controllers: Users', () => {
    describe('Get a user: getById()', () => {
        it('should return a user', () => {
            const app = {
                datasource: {
                    models: {
                        User: {
                            findById: td.function(),
                        },
                    },
                },
            };

            const expectedResponse = {
                id: 1,
                name: 'Test',
                email: 'email@email.com',
            };

            td.when(app.datasource.models.User.findById(expectedResponse.id))
                .thenResolve(expectedResponse);

            const controller = new UsersController(app);
            return controller.getById(expectedResponse.id)
                .then(response => {
                    expect(response.statusCode).to.be.equal(200);
                    expect(response.data).to.be.equal(expectedResponse);
                });
        });
    });

    describe('Create user: create()', () => {
        it('should create a user', () => {
            const app = {
                datasource: {
                    models: {
                        User: {
                            create: td.function(),
                        },
                    },
                },
            };

            const requestBody = {
                name: 'Test',
                email: 'lucas@lucas.com',
                password: 'pass',
            };

            const expectedResponse = {
                id: 1,
                name: 'Test',
                email: 'lucas@lucas.com',
            };

            td.when(app.datasource.models.User.create(requestBody))
                .thenResolve(expectedResponse);

            const controller = new UsersController(app);
            return controller.create(requestBody)
                .then(response => {
                    expect(response.statusCode).to.be.equal(201);
                    expect(response.data).to.be.equal(expectedResponse);
                });
        });
    });

    describe('Update user: update()', () => {
        it('should update a user', () => {
            const app = {
                datasource: {
                    models: {
                        User: {
                            findByIdAndUpdate: td.function(),
                            findById: td.function(),
                        },
                    },
                },
            };

            const requestBody = {
                name: 'Test',
            };

            const expectedResponse = {
                id: 1,
                name: 'Test',
                email: 'teste@teste.com',
            };

            td.when(app.datasource.models.User.findByIdAndUpdate(expectedResponse.id, {
                $set: requestBody,
            })).thenResolve(true);
            td.when(app.datasource.models.User.findById(expectedResponse.id))
                .thenResolve(expectedResponse);

            const controller = new UsersController(app);
            return controller.update(expectedResponse.id, requestBody)
                .then(response => {
                    expect(response.statusCode).to.be.equal(200);
                    expect(response.data).to.be.equal(expectedResponse);
                });
        });
    });

    describe('Delete user: delete()', () => {
        it('should delete a user', () => {
            const app = {
                datasource: {
                    models: {
                        User: {
                            remove: td.function(),
                        },
                    },
                },
            };

            const expectedResponse = {
                id: 1,
            };

            td.when(app.datasource.models.User.remove({
                _id: expectedResponse.id,
            })).thenResolve('');

            const controller = new UsersController(app);
            return controller.delete(expectedResponse.id)
                .then(response => {
                    expect(response.statusCode).to.be.equal(204);
                    expect(response.data).to.be.equal('');
                });
        });
    });
});
