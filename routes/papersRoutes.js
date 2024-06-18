const express = require('express');
const router = express.Router();
const { postPapers, getPapers } = require('../controllers/papersController');

router.post('/postPapers', postPapers);
router.get('/getPapers/:branchName', getPapers);

module.exports = router;