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
    email: {
        key: process.env.EMAIL_KEY || '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',
        timeout: process.env.EMAIL_TIMEOUT || 5000,
        template: process.env.EMAIL_TEMPLATE || '543a356e-e969-478e-b8df-a1a7ccf77f69',
    },
};
