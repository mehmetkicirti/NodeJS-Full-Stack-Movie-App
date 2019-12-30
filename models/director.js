let directors;
module.exports = class Director {
    constructor(name,bio,yearOfBirth,country,imageURL){
        this.id = (Math.floor(Math.random()*1000)+1);
        this.name = name;
        this.yearOfBirth = yearOfBirth;
        this.country = country;
        this.bio = bio;
        this.imageURL = imageURL;
    }
    saveDirector(){
        let directors = Director.getDirectorsFromStorage();
        directors.push(this);
        console.log(directors);
        localStorage.setItem("directors",JSON.stringify(directors));
    }
    static getDirectorsFromStorage(){
        if (localStorage.getItem("directors") === null) {
            directors=[];
        }else{
            directors = JSON.parse(localStorage.getItem("directors"));
            // directors.remove();
        }
        return directors;
    }
    static getAll(){
        return this.getDirectorsFromStorage();
    }
    static getById(id){
        let directors = this.getDirectorsFromStorage();
        return directors.find(c=>c.id === Number(id));
    }
    static Update(director){
        let directors = Director.getDirectorsFromStorage();
        const index = directors.findIndex(m=>m.id === Number(director.id));
        directors[index].name.name = director.name;
        directors[index].name.bio = director.bio;
        directors[index].name.country = director.country;
        directors[index].name.yearOfBirth = director.yearOfBirth;
        directors[index].imageURL = director.imageURL;
        localStorage.setItem("directors",JSON.stringify(directors));
    }
    static deleteById(id){
        let directors = this.getDirectorsFromStorage();
        const index = directors.findIndex(c=>c.id == Number(id));
        directors.splice(index,1);
        localStorage.setItem('directors',JSON.stringify(directors));
    }
}