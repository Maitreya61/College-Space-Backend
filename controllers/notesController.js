const Notes = require("../models/Notes");
const User = require("../models/User");
const mongoose = require('mongoose');



exports.getNotes = async (req, res) => {
    try {
      const branchName = req.params.branchName;
      const notes = await Notes.findOne({ branchName });
  
      if (!notes) {
        return res.status(404).json({ message: 'Subjects not found' });
      }
  
      res.json(
        notes.subjects,
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }



exports.postNotes = async (req, res) => {
    const { branchName, subjectName, chapterName, chapterLink } = req.body;

    try {
        // Find if the branch already exists
        let subject = await Notes.findOne({ branchName: branchName });

        // If the branch doesn't exist, create a new one
        if (!subject) {
            subject = new Notes({
                branchName: branchName,
                subjects: [{
                    subjectName: subjectName,
                    chapters: [] // Initialize chapters array
                }]
            });
        } else {
            // Find or create the subject within the branch
            let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
            if (!subjectObj) {
                subject.subjects.push({
                    subjectName: subjectName,
                    chapters: [] // Initialize chapters array
                });
            }
        }

        // Find or create the chapter within the subject
        let subjectObj = subject.subjects.find(sub => sub.subjectName === subjectName);
        let chapterObj = subjectObj.chapters.find(chapter => chapter.chapterName === chapterName);
        if (!chapterObj) {
            chapterObj = { chapterName: chapterName, chapterLink: chapterLink };
            subjectObj.chapters.push(chapterObj);
        } else {
            // Update the chapter link if the chapter already exists
            chapterObj.chapterLink = chapterLink;
        }

        // Save the changes
        const updatedSubject = await subject.save();
        res.status(201).json(updatedSubject); // Send back the updated subject
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLikedNotes = async (req, res) => {
    try {
        const userId = req.params.userId; // Ensure userId is correctly formatted
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        return res.json(user.likedNotes);
    } catch (error) {
        console.error("Error fetching liked notes:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.handleLikes = async (req, res) => {
    console.log("Liked");

    const { userId, chapterId } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        // Find the note by chapterId
        const chapter = await Notes.findOneAndUpdate(
            { 'subjects.chapters._id': chapterId }, // Match documents where any chapter's _id matches the given chapterId
            { $inc: { 'subjects.$[subject].chapters.$[index].likes': 1 } }, 
            {
              arrayFilters: [
                { 'subject.chapters._id': chapterId }, 
                { 'index._id': chapterId }
              ],
              new: true 
            }
          );


        // Check if user and note exist
        if (!user || !chapter) {
            return res.status(404).json({ error: "User or Note not found" });
        }


        // Check if the note is already liked by the user
        if (user.likedNotes.includes(chapterId)) {
            return res.status(400).json({ error: "Note already liked by the user" });
        }


        // Add the note to the user's likedNotes
        user.likedNotes.push(chapterId);
        await user.save();

        // Increase the likes of the note

        return res.json(user.likedNotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};


exports.handleUnLikes = async (req, res) => {
    console.log("Unliked");

    const { userId, chapterId } = req.body;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the chapterId is valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({ error: "Invalid chapterId" });
        }

        const chapter = await Notes.findOneAndUpdate(
            { 'subjects.chapters._id': chapterId }, 
            { $inc: { 'subjects.$[subject].chapters.$[index].likes': -1 } }, 
            {
              arrayFilters: [
                { 'subject.chapters._id': chapterId }, 
                { 'index._id': chapterId }
              ],
              new: true 
            }
          );

       
        user.likedNotes = user.likedNotes.filter(id => id.toString() !== chapterId);

        
        await user.save();

        return res.json(user.likedNotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};

