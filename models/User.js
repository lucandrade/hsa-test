import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    recoverToken: { type: String },
});

UserSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {  // eslint-disable-line
    const user = this;
    if (user.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, (err, salt) => {  // eslint-disable-line
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, (err, hash) => {  // eslint-disable-line
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

export default mongoose.model('User', UserSchema);
