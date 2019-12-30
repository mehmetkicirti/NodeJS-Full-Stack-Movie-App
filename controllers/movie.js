const Movie = require('../models/movie');
const Category= require('../models/category');
const Director= require('../models/director');

exports.getIndex = (req,res,next) => {
    const movies = Movie.getAll();
    const categories = Category.getAll();
    res.render('movie/index',{title:"Homepage",movies:movies,categories:categories,path:'/'});
};

exports.getMovies = (req,res,next)=> {
    const movies = Movie.getAll();
    const categories = Category.getAll();
    res.render('movie/movies',{title:'Movies',movies:movies,categories:categories,path:'/movies'});
};

exports.getMovie = (req,res,next) => {
    const movieId = req.params.id;
    const movie = Movie.getById(movieId);
    const director = Director.getById(movie.directorId);
    res.render('movie/movie-detail',{title:movie.name.name,movie:movie,director:director,path:'/movies'});
};

exports.getMoviesByCategoryId = (req,res,next) => {
    const categoryId = req.params.id;
    const movies = Movie.getCategoryByCategoryId(categoryId);
    const categories= Category.getAll();
    res.render('movie/movies',{title:'Homepage',movies:movies,categories:categories,selected:categoryId,path:'/movies'}); 
}

exports.getDirectors = (req,res,next) => {
    const directors = Director.getAll();
    res.render('movie/directors',{title:"Directors",directors:directors,path:'/directors'});
}

exports.getDirector = (req,res,next) => {
    const director = Director.getById(req.params.id);
    res.render('movie/director-detail',{title:director.name.name,director:director,path:'/directors'});
}