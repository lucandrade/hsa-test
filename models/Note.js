import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    text: { type: String, maxlength: [256, 'Please enter no more than 256 characters.'] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
}, {
    timestamps: true,
    versionKey: false,
});

NoteSchema.set('toJSON', {
    transform: function noteSchemaToJson(doc, ret) {
        const retJson = {
            id: ret._id,
            text: ret.text,
        };
        return retJson;
    },
});

export default mongoose.model('Note', NoteSchema);
