const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    branchName: String,
    subjects: [
        {
            subjectName: String,
            chapters: [
                {
                    chapterName: String,
                    chapterLink: String,
                    likes: {
                        type: Number,
                        default: 0,
                    }
                }
            ]
        }
    ]
}
);

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes