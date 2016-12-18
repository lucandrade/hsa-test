import cors from 'cors';
import Users from './users';

export default app => {
    app.use(cors({
        origin: true,
        credentials: true,
    }));

    app.use('/v1', Users(app));
};
