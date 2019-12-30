// const categoriess = [
//     {id:"1",name:"Action",description:"Action Films"},
//     {id:"1",name:"Comedy",description:"Comedy Films"},
//     {id:"1",name:"Science-Fiction",description:"Science-Fiction Films"},
// ]
let categories;
module.exports = class Category {
    constructor(name,description){
        this.id = Math.floor(Math.random()*10000)+1;
        this.name = name;
        this.description = description;
    }
    
    saveCategory(){
        let Categories = Category.getCategoriesFromStorage();
        Categories.push(this);
        localStorage.setItem('categories',JSON.stringify(Categories));
    }
    static getCategoriesFromStorage(){
        if (localStorage.getItem('categories')=== null) {
           categories=[];
        }else{
            categories = JSON.parse(localStorage.getItem('categories'));
        }
        return categories;
    }
    static Update(category){
        let categories = Category.getCategoriesFromStorage();
        const index = categories.findIndex(m=>m.id === Number(category.id));
        console.log(index);
        categories[index].name.name = category.name;
        categories[index].name.description = category.description;
        localStorage.setItem('categories',JSON.stringify(categories));
    }
    static getAll(){
        const categories = this.getCategoriesFromStorage();
        return categories;
    }
    static getById(id){
        let categories = this.getCategoriesFromStorage();
        let category = categories.find(c=>Number(c.id) === Number(id));
        return category;
    }
    static deleteById(id){
        let categories = this.getCategoriesFromStorage();
        const index = categories.findIndex(c=>Number(c.id) === Number(id));
        categories.splice(index,1);
        localStorage.setItem('categories',JSON.stringify(categories));
    }
}