const express = require('express');
const router = express.Router();
const { analyzeSkillGap, generateRoadmap } = require('../controllers/careerController');

router.post('/skill-gap', analyzeSkillGap);
router.post('/roadmap', generateRoadmap);

module.exports = router;