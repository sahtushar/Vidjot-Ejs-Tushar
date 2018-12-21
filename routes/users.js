var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//Users model
require('../models/users');
const User = mongoose.model('users');

const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get('/login', (req, res) => {

    let message="";
console.log(req.query.message);
if(req.query.message){
    message=req.query.message;
    console.log(message);
}

    console.log("login page");
    res.render("users/login",{
         message:message
    });

});
router.get('/register', (req, res) => {


    res.render("users/register", {
        errors: [],
        name: "",
        email: "",
        password: "",
        password2: ""
    });

});



router.post('/register', (req, res) => {

    let errors = [];
    //password validations
    if (req.body.password !== req.body.password2) {
        errors.push({text: "passwords do not match"});

    }

    if (req.body.password.length < 4) {
        errors.push({text: "Password length is small"});

    }

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }

    //if no errors regarding the validations
    else {

        //all validations passed
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            firstUser:false

        }); //we will create a newUser variable

        //now we have to check whether the email id exists or not
        User.findOne({email:newUser.email})
            .then((user)=>{
                if(user && user.googleID.length>0)
                {
                    errors.push({text: "Use Google Login"})

                    res.render("users/register",{
                        errors:errors,
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        password2:req.body.password2
                    });
                }
                else if(user && user.googleID.length<=0){

                    errors.push({text:"User already Exists"});
                    res.render("users/register",{
                        errors:errors,
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    });

                    console.log("error_msg",error_msg);
                }
                else{
                    bcrypt.genSalt(10, (err, salt) => {  //to generate salt for length upto 10 to hash the password
                        bcrypt.hash(newUser.password, salt, (err, hash) => { //these two lines is used to convert entered password to hash

                            newUser.password = hash;
                            newUser.save()
                                .then(() => {
                                    req.flash("success_msg", "Registration Successful");
                                    res.redirect("/users/login");
                                })
                        })
                    })
                }

            })

    }




});
router.get('/setPassword', (req, res) => {
    console.log("set Password");
    res.render('users/setPassword', {
        errors: []
    })

})
router.post('/login', (req,res,next)=>{


    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login?message=Wrong password or user does not exists',
        failureFlash:true,


    })(req,res,next);





});

router.post('/setPassword', (req, res) => {
    let errors = [];
    if (req.body.password !== req.body.password2) {
        errors.push({text: "Password does not match"});
    }
    if (req.body.password.length < 4) {
        errors.push({text: "Password length is less than 4"})
    }

    if (errors.length > 0) {
        res.render('users/setPassword', {
            errors: errors
        });
    }
    else {

        User.findOne({
            email:req.user.email
        })
            .then((user)=>{
            bcrypt.genSalt(10, (err, salt) => {  //to generate salt for length upto 10 to hash the password
                bcrypt.hash(req.body.password, salt, (err, hash) => { //these two lines is used to convert entered password to hash

                    user.password = hash;
                    user.firstUser = false;

                    user.save()
                        .then((user) => {
                            req.flash("success_msg", "Password Set Successfully");
                            console.log(user.firstUser);
                            res.redirect("/ideas");
                        })
                })
            })
        })



    }


});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success_msg","logout Successfully");
    res.redirect('/users/login/');

});


module.exports = router;