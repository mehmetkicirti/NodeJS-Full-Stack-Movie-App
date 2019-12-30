const express= require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

const isAdmin = require('../middleware/isAdmin');
const locals = require('../middleware/locals');
//movie
router.get("/add-movie",isAdmin,locals,adminController.getAddMovie);
  
router.post('/add-movie',isAdmin,locals,adminController.postAddMovie);

router.get("/edit-movie/:id",isAdmin,locals,adminController.getEditMovie);
  
router.post('/edit-movie',isAdmin,locals,adminController.postEditMovie);

router.get('/movies',isAdmin,locals,adminController.getMovies);

router.post('/delete-movie',isAdmin,locals,adminController.postDeleteMovie);
//director

router.get("/add-director",isAdmin,locals,adminController.getAddDirector);
  
router.post('/add-director',isAdmin,locals,adminController.postAddDirector);

router.get("/edit-director/:id",isAdmin,locals,adminController.getEditDirector);
  
router.post('/edit-director',isAdmin,locals,adminController.postEditDirector);

router.get('/directors',isAdmin,locals,adminController.getDirectors);

router.post('/delete-director',isAdmin,locals,adminController.postDeleteDirector);
//category

router.get("/add-category",isAdmin,locals,adminController.getAddCategory);
  
router.post('/add-category',isAdmin,locals,adminController.postAddCategory);

router.get("/edit-category/:id",isAdmin,locals,adminController.getEditCategory);
  
router.post('/edit-category',isAdmin,locals,adminController.postEditCategory);

router.get('/categories',isAdmin,locals,adminController.getCategories);

router.post('/delete-category',isAdmin,locals,adminController.postDeleteCategory);

module.exports = router;