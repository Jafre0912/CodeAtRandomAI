const express = require('express');
const router = express.Router();
const { analyzeSkillGap, generateRoadmap } = require('../controllers/careerController');

// Define routes
router.post('/skill-gap', analyzeSkillGap);
router.post('/roadmap', generateRoadmap);

module.exports = router;