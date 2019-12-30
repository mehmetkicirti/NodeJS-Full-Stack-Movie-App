const Movie = require("../models/movie");
const Category = require("../models/category");
const Director = require("../models/director");
const fs = require('fs');
exports.getMovies = (req,res,next) => {
    const movies = Movie.getAll();
    res.render('admin/movies',{title:"Admin Movies",movies:movies,path:"/admin/movies",action:req.query.action});
};
exports.getCategories = (req,res,next) => {
    const categories = Category.getAll();
    res.render('admin/categories',{title:"Admin Categories",categories:categories,path:"/admin/categories",action:req.query.action});
};
exports.getDirectors = (req,res,next) => {
    const directors = Director.getAll();
    res.render('admin/directors',{title:"Admin Directors",directors:directors,path:"/admin/directors",action:req.query.action});
};

exports.getAddMovie = (req,res,next) => {
    const categories = Category.getAll();
    const directors = Director.getAll();
    res.render('admin/add-movie',{title:"New Movie",categories:categories,directors:directors,path:'/admin/add-movie'});
};
exports.getAddDirector = (req,res,next) => {
    res.render('admin/add-director',{title:"New Director",path:'/admin/add-director'});
};
exports.getAddCategory = (req,res,next) => {
    res.render('admin/add-category',{title:"New Category",path:'/admin/add-category'});
};

exports.postAddMovie = (req,res,next) => {
    const movie = new Movie({
        name:req.body.name,
        imdb_score:req.body.imdb_score,
        embedURL:req.body.embedURL,
        categoryId:req.body.categoryId,
        directorId:req.body.directorId,
        description:req.body.description
    });
    const file = req.file;
    if (!file) {
        return res.render('admin/add-movie',{title:"New Movie",errorMessage:'Please enter a image',categories:categories,directors:directors,path:'/admin/add-movie'});
    }
    movie.imageURL = file.filename;
    movie.saveMovie();
    res.redirect('/admin/movies?action=add');
}

exports.postAddDirector = (req,res,next) => {
    const director = new Director({
        name:req.body.name,
        country:req.body.country,
        yearOfBirth:req.body.yearOfBirth,
        bio:req.body.bio
    });
    const file = req.file;
    if (!file) {
        return res.render('admin/add-director',{title:"New Director",errorMessage:'Please enter a image',path:'/admin/add-director'});
    }
    director.imageURL = file.filename;
    director.saveDirector();
    res.redirect('/admin/directors?action=add');
}

exports.postAddCategory = (req, res, next) => {

    const name = req.body.name;
    const description = req.body.description;
    
    const category = new Category({
        name: name,
        description: description
    });
    category.saveCategory();
    res.redirect('/admin/categories?action=create');
}

exports.getEditMovie = (req,res,next) => {
    const movie = Movie.getById(req.params.id);
    const categories = Category.getAll();
    const directors = Director.getAll();
    res.render('admin/edit-movie',{title:"Edit Movie",categories:categories,directors:directors,movie:movie,path:'/admin/edit-movie'});
}

exports.getEditDirector = (req,res,next) => {
    const director = Director.getById(req.params.id);
    res.render('admin/edit-director',{title:"Edit Director",director:director,path:'/admin/edit-director'});
}
exports.getEditCategory = (req,res,next) => {
    const category = Category.getById(req.params.id);
    res.render('admin/edit-category',{title:"Edit Category",category:category,path:'/admin/edit-category'});
}

exports.postEditMovie = (req,res,next) => {
    const movie = Movie.getById(req.body.id);
    const image = req.file;
    movie.name = req.body.name;
    movie.imdb_score = req.body.imdb_score;
    movie.categoryId = req.body.categoryId;
    movie.description = req.body.description;
    movie.embedURL= req.body.embedURL;
    movie.directorId = req.body.directorId;

    if(image){
        fs.unlink('public/img/'+movie.name.imageURL,err=> {
            if(err)
                console.log(err);
        });

    movie.imageURL = image.filename;
    }

    Movie.Update(movie);
    res.redirect('/admin/movies?action=edit');
}
exports.postEditDirector = (req,res,next) => {
    const director = Director.getById(req.body.id);
    const image = req.file;
    director.name = req.body.name;
    director.country = req.body.country;
    director.yearOfBirth= req.body.yearOfBirth;
    director.bio = req.body.bio;

    if(image){
        fs.unlink('public/img/'+director.name.imageURL,err=> {
            if(err)
                console.log(err);
        });

        director.imageURL = image.filename;
    }

    Director.Update(director);
    res.redirect('/admin/directors?action=edit');
}
exports.postEditCategory = (req,res,next) => {
    const category = Category.getById(req.body.id);
    category.name = req.body.name;
    category.description = req.body.description;
    Category.Update(category);
    res.redirect('/admin/categories?action=edit');
}




//Delete
exports.postDeleteMovie = (req,res,next) => {
    const movie = Movie.getById(req.body.id);

    fs.unlink('public/img/'+movie.imageURL,err=>{
        if(err)
            console.log(err)
    });
    Movie.deleteById(req.body.id);
    res.redirect('/admin/movies?action=delete');
}

exports.postDeleteDirector = (req,res,next) => {
    const director = Director.getById(req.body.id);

    fs.unlink('public/img/'+director.imageURL,err=>{
        if(err)
            console.log(err)
    });
    Director.deleteById(req.body.id);
    res.redirect('/admin/directors?action=delete');
};

exports.postDeleteCategory = (req, res, next) => {
    Category.deleteById(req.body.id);
    res.redirect('/admin/categories?action=delete');
};
