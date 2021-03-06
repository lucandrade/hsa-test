import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    recoverToken: { type: String },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
}, {
    timestamps: true,
    versionKey: false,
});

UserSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.set('toJSON', {
    transform: function userSchemaToJson(doc, ret) {
        const retJson = {
            id: ret._id,
            name: ret.name,
            email: ret.email,
            notes: 0,
        };
        if (ret.notes instanceof Array && ret.notes.length > 0) {
            retJson.notes = ret.notes.length;
        }
        return retJson;
    },
});

UserSchema.pre('save', function (next) { // eslint-disable-line
    const user = this;
    if (user.isModified('password') || user.isNew) {
        bcrypt.genSalt(10, (err, salt) => { // eslint-disable-line
            if (err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, (err, hash) => { // eslint-disable-line
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
