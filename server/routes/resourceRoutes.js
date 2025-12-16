const express = require('express');
const router = express.Router();
const { 
  getResources, 
  createResource, 
  getResourceById, 
  updateResource, 
  deleteResource 
} = require('../controllers/resourceController');

router.route('/')
  .get(getResources)
  .post(createResource);

router.route('/:id')
  .get(getResourceById)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
