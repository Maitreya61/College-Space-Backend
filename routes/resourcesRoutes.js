const express = require('express');
const router = express.Router();
const { getResources, postResources } = require('../controllers/resourcesController');

router.get('/getResources/:branchName', getResources);
router.post('/postResources', postResources);

module.exports = router;