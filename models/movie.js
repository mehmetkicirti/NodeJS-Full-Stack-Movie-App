// let localStorage = require('localStorage');
let movies;
module.exports = class Movie {
    constructor(name,imdb_score,imageURL,embedURL,categoryId,directorId,description){
        this.id = (Math.floor(Math.random()*99999)+1);
        this.name = name;
        this.description = description;
        this.imageURL= imageURL;
        this.imdb_score = imdb_score;
        this.embedURL = embedURL;
        this.categoryId = categoryId;
        this.directorId = directorId;
    }
    saveMovie(){
        let Movies = Movie.getMoviesFromStorage();
        Movies.push(this);
        localStorage.setItem("movies",JSON.stringify(Movies));
    }
    static getMoviesFromStorage(){
        if (localStorage.getItem("movies") === null) {
            movies=[];
        }else{
            movies = JSON.parse(localStorage.getItem("movies"));
        }
        return movies;
    }
    static getAll(){
        return Movie.getMoviesFromStorage();
    }
    static getById(id){
        let movies = Movie.getMoviesFromStorage();
        return movies.find(c=>c.id === Number(id));
    }
    static Update(movie){
        let movies = Movie.getMoviesFromStorage();
        const index = movies.findIndex(m=>m.id === Number(movie.id));
        movies[index].name.name = movie.name;
        movies[index].name.description = movie.description;
        movies[index].name.imdb_score = movie.imdb_score;
        movies[index].imageURL = movie.imageURL;
        movies[index].name.embedURL = movie.embedURL;
        movies[index].name.categoryId = movie.categoryId;
        movies[index].name.directorId = movie.directorId;
        localStorage.setItem("movies",JSON.stringify(Movies));
    }
    static deleteById(id){
        let movies = Movie.getMoviesFromStorage();
        const index = movies.findIndex(c=>Number(c.id) === Number(id));
        movies.splice(index,1);
        localStorage.setItem('movies',JSON.stringify(movies));
    }
    static getCategoryByCategoryId(categoryId){
        let movies = Movie.getMoviesFromStorage();
        return movies.filter(m=>m.name.categoryId===categoryId);
    }
}