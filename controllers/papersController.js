const Papers = require("../models/Papers");



exports.getPapers = async (req, res) => {
    try {
      const branchName = req.params.branchName;
      const papers = await Papers.findOne({ branchName });
  
      if (!papers) {
        return res.status(404).json({ message: 'Subjects not found' });
      }
  
      res.json(papers.subjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

exports.postPapers = async (req, res) => {
    const { branchName, subjectName, paperName, paperLink } = req.body;

    try {
        // Find if the branch already exists
        let subject = await Papers.findOne({ branchName: branchName });

        // If the branch doesn't exist, create a new one
        if (!subject) {
            subject = new Papers({
                branchName: branchName,
                subjects: [{
                    subjectName: subjectName,
                    papers: [] // Initialize papers array
                }]
            });
        } else {
            // Find or create the subject within the branch
            let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
            if (!subjectObj) {
                subject.subjects.push({
                    subjectName: subjectName,
                    papers: [] // Initialize papers array
                });
            }
        }

        // Find or create the paper within the subject
        let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
        let paperObj = subjectObj.papers.find(paper => paper.paperName === paperName);
        if (!paperObj) {
            paperObj = { paperName: paperName, paperLink: paperLink };
            subjectObj.papers.push(paperObj);
        } else {
            // Update the paper link if the paper already exists
            paperObj.paperLink = paperLink;
        }

        // Save the changes
        const updatedSubject = await subject.save();
        res.status(201).json(updatedSubject); // Send back the updated subject
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};