const Resources = require("../models/Resources");

exports.getResources = async (req, res) => {
    try {
      const branchName = req.params.branchName;
      const branches = await Resources.findOne({ branchName });
  
      if (!branches) {
        return res.status(404).json({ message: 'Subjects not found' });
      }
  
      res.json(branches.subjects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }



exports.postResources = async (req, res) => {
    const { branchName, subjectName, resourceName, resourceLink } = req.body;

    try {
        // Find if the branch already exists
        let subject = await Resources.findOne({ branchName: branchName });

        // If the branch doesn't exist, create a new one
        if (!subject) {
            subject = new Resources({
                branchName: branchName,
                subjects: [{
                    subjectName: subjectName,
                    resources: [] // Initialize resources array
                }]
            });
        } else {
            // Find or create the subject within the branch
            let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
            if (!subjectObj) {
                subject.subjects.push({
                    subjectName: subjectName,
                    resources: [] // Initialize resources array
                });
            }
        }

        // Find or create the resource within the subject
        let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
        let resourceObj = subjectObj.resources.find(resource => resource.resourceName === resourceName);
        if (!resourceObj) {
            resourceObj = { resourceName: resourceName, resourceLink: resourceLink };
            subjectObj.resources.push(resourceObj);
        } else {
            // Update the resource link if the resource already exists
            resourceObj.resourceLink = resourceLink;
        }

        // Save the changes
        const updatedSubject = await subject.save();
        res.status(201).json(updatedSubject); // Send back the updated subject
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};