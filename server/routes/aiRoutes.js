const express = require('express');
const router = express.Router();
const { 
  analyzeDemand, 
  generateFramework, 
  recommendContent, 
  optimizeItinerary, 
  buildAssessment 
} = require('../controllers/aiController');

router.route('/analyze-demand')
  .post(analyzeDemand);

router.route('/generate-framework')
  .post(generateFramework);

router.route('/recommend-content')
  .post(recommendContent);

router.route('/optimize-itinerary')
  .post(optimizeItinerary);

router.route('/build-assessment')
  .post(buildAssessment);

module.exports = router;
