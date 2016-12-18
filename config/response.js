import HttStatus from 'http-status';

const success = (data, statusCode = HttStatus.OK) => ({
    data,
    statusCode,
});

const error = (err, statusCode = HttStatus.BAD_REQUEST) => {
    if (err.errors) {
        const messages = {};
        for (const field in err.errors) { // eslint-disable-line
            if (err.errors[field].message) {
                messages[field] = err.errors[field].message;
            }
        }

        if (Object.keys(messages).length > 0) {
            return success({
                messages,
            }, statusCode);
        }
    }

    return success({
        error: err.message,
    }, statusCode);
};

export default {
    success,
    error,
};
