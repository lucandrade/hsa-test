export default {
    port: process.env.PORT || '7001',
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '',
        name: process.env.DB_NAME || 'hsa-test',
        user: process.env.DB_USER || '',
        pass: process.env.DB_PASS || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '0832475ogj342l5hj',
        session: { session: false },
    },
};
