const mongoose = require('mongoose');

const papersSchema = new mongoose.Schema({
    branchName: String,
    subjects: [
        {
            subjectName: String,
            papers: [
                {
                    paperName: String,
                    paperLink: String,
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

module.exports = mongoose.model('Papers', papersSchema);