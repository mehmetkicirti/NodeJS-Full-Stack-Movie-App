const express= require('express');
const router = express.Router();
const movieController = require('../controllers/movie');
const isAuthenticated = require('../middleware/authentication');
const locals = require('../middleware/locals');

router.get("/",locals,movieController.getIndex);
router.get("/movies",locals,movieController.getMovies);
router.get("/movies/:id",locals,movieController.getMovie);
router.get("/categories/:id",locals,movieController.getMoviesByCategoryId);
router.get("/directors",locals,isAuthenticated,movieController.getDirectors);
router.get("/directors/:id",locals,isAuthenticated,movieController.getDirector);

module.exports=router;