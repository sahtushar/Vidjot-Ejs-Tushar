const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express();
const db=require('./config/database');

//for routes
const ideas = require('./routes/ideas');
const users =require('./routes/users');
const google_auth=require('./routes/google-auth');
const session = require('express-session');
const passport=require('passport');

//view engine
console.log("Mongo URLS",db.mongoURI);
mongoose.connect(db.mongoURI, {

    useNewUrlParser:true
})

    .then(() => console.log("mongoose connected to mongodb.."))
    .catch((err) => console.log(err));

//load Idea model
require('./models/idea');
const Idea = mongoose.model('ideas');


//Passport Config
require('./config/passport')(passport);
require('./config/passport-google')(passport)

app.locals.message = app.locals.message || null;
//setting engine
app.set('view engine', 'ejs');
app.use(session(
    {
        secret: "Shh, its a secret!",
        resave: true,
        saveUninitialized: true
    }
));



app.use(flash());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());





//declaring error messages using flash
app.use((req, res, next) => {

    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.user=req.user || null;
    next();

});


//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Method override middleware
app.use(methodOverride('_method'));



app.get('/', (req, res) => {
    const title = "Vidjot By Tushar";

    return res.render('index', {
        title: title
    });
});
//about page
app.get('/about', (req, res) => {
    return res.render('about');
});


//normal method to delete value
app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    console.log("delete method");
    Idea.findOneAndDelete({
        _id: id
    })
        .then(() => {

            req.flash("success_msg", "Successfully Deleted");
            res.redirect('/ideas');
        });

});


//normal method to update value
app.post('/update/:id', (req, res) => {
    let id = req.params.id;
    Idea.findOneAndUpdate(id, {title: req.body.title, details: req.body.details})
        .then(() => {
            req.flash("success_msg", "Successfully Updated");
            res.redirect('/ideas');
        })

});

//everything that goes with /ideas should go to the routes/ideas.
app.use("/ideas", ideas);

//everything that goes with /users should go to the routes/users.
app.use("/users" ,users);


app.use('/google-auth',google_auth);

const port = process.env.PORT ||5002;
app.listen(port, () => {
    console.log(`server started at ${port}`);

});
