const express = require('express');
const router = express.Router();
const { getNotes, postNotes, handleLikes, getLikedNotes, handleUnLikes } = require('../controllers/notesController');


router.get('/getNotes/:branchName', getNotes);
router.post('/postNotes', postNotes);
router.post('/likedNotes', handleLikes);
router.post('/unlikedNotes', handleUnLikes);
router.get('/getLikedNotes/:userId', getLikedNotes);



module.exports = router;