import mongoose from 'mongoose';
import HttStatus from 'http-status';
import response from '../config/response';

export default class NotesController {
    constructor(app) {
        this.app = app;
        this.model = app.datasource.models.Note;
        this.user = null;
        this.note = null;
    }

    setUser(user) {
        this.user = user;
        return this;
    }

    create(text) {
        const data = {
            text,
            user: this.user.id,
        };
        return this.model.create(data)
            .then(res => {
                if (res) {
                    this.note = res;
                    return this.app.datasource.models.User.findById(this.user.id);
                }

                throw new Error('Error creating note');
            })
            .then(user => {
                if (user) {
                    user.notes.push(this.note._id);
                    return user.save();
                }

                throw new Error('Error retrieving logged user');
            })
            .then(updated => {
                if (updated) {
                    return response.success(this.note, HttStatus.CREATED);
                }

                throw new Error('Error updating logged user');
            })
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    get() {
        return this.model.find({
            user: this.user.id,
        })
            .then(res => response.success(res))
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    update(noteId, text) {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return new Promise((resolve, reject) =>
                reject(response.error(new Error('Invalid note'), HttStatus.UNPROCESSABLE_ENTITY)));
        }

        return this.model.findById(noteId)
            .then(res => {
                if (res) {
                    const note = res;
                    note.text = text;
                    return note.save();
                }

                throw new Error('Note not found');
            })
            .then(res => {
                if (res) {
                    return this.model.findById(noteId);
                }

                throw new Error('Error updating note');
            })
            .then(res => response.success(res))
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }

    delete(noteId) {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return new Promise((resolve, reject) =>
                reject(response.error(new Error('Invalid note'), HttStatus.UNPROCESSABLE_ENTITY)));
        }

        return this.model.findById(noteId)
            .then(res => {
                if (res) {
                    this.note = res;
                    return res.remove();
                }

                throw new Error('Note not found');
            })
            .then(res => {
                if (res) {
                    return this.app.datasource.models.User.findById(this.user.id);
                }

                throw new Error('Error deleting note');
            })
            .then(user => {
                if (user) {
                    if (user.notes.indexOf(this.note.id) >= 0) {
                        user.notes.splice(user.notes.indexOf(this.note.id), 1);
                        return user.save();
                    }
                    return user.save();
                }

                throw new Error('Error updating user notes');
            })
            .then(() => response.success('', HttStatus.NO_CONTENT))
            .catch(err => response.error(err, HttStatus.UNPROCESSABLE_ENTITY));
    }
}
