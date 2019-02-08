const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/users/login' }), (req, res) => {
        res.redirect('/feedback');
    });

router.get('/verify',(req,res)=>{

    console.log("verify method")
    if(req.user){
        console.log(req.user)
    }
    else
    {
        console.log("not defined")
    }
});

module.exports = router;