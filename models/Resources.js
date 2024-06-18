const mongoose = require('mongoose');

const resourcesSchema = new mongoose.Schema({
    branchName: String,
    subjects: [
        {
            subjectName: String,
            resources: [
                {
                    resourceName: String,
                    resourceLink: String,
                    likes: {
                        type: Number,
                        default: 0,
                    }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Resources', resourcesSchema);