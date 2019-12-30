const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const movieRoutes = require('./routes/movie');
const errorController = require('./controllers/errors');
const multer = require('multer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
app.set('view engine','pug');
app.set('views','./views');
app.use(express.static(path.join(__dirname,'./public')));
app.use(bodyParser.urlencoded({extended:false}));

const ConnectionString = 'mongodb+srv://se480:hZRYXJkRSISuhhCk@cluster0-w61xw.mongodb.net/test?retryWrites=true&w=majority';

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch/db1');
}
var store = new mongoDbStore({
    uri: ConnectionString,
    collection: 'mySessions'
});
app.use(cookieParser());
app.use(session({
    secret: 'se480_bomMovie',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000
    },
    store: store
}));
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null, './public/img/');
    },
    filename:function(req,file,callback){
        callback(null, file.fieldname + "-"+Date.now()+ path.extname(file.originalname)); //img-3342.jpg
    }
})
app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) });
})


app.use(multer({storage:storage}).single('image'));
app.use('/admin',adminRoutes);
app.use(accountRoutes);
app.use(movieRoutes);


app.use('/500', errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {

    res.status(500).render('error/500', { title: 'Error' });
});
mongoose.connect(ConnectionString,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        console.log('connected to mongodb');
        app.listen(3000);
        console.log("Listening port on 3000");
    })
    .catch(err => {
        console.log(err);
    })