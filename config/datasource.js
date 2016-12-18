import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

let database = null;

const loadModels = () => {
    const dir = path.join(__dirname, '../models');
    const models = [];
    fs.readdirSync(dir).forEach(file => {
        const modelDir = path.join(dir, file);
        const model = require(modelDir); // eslint-disable-line
        models[model.default.modelName] = model.default;
    });
    return models;
};

export default app => {
    if (!database) {
        const config = app.config.database;
        database = {
            models: loadModels(),
        };
        mongoose.Promise = global.Promise;
        mongoose.connect(`mongodb://${config.host}:${config.port}/${process.env.NODE_ENV}_${config.name}`);
        database.models = loadModels();
    }
    return database;
};
