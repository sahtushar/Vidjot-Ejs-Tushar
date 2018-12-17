const LocalStrategy=require("passport-local").Strategy;

const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

require('../models/users');
const User=mongoose.model('users');

module.exports=((passport)=>{


    passport.use(new LocalStrategy(
        {
            usernameField: 'email'  //given email
        },(email, password, done)=>
             {
                   User.findOne({
                       email:email
                   })
                       .then(user =>{
                           if(!user)
                           {
                               console.log("no user");

                               return done(null, false , {message:'No user matched'})
                           }

                           //match password
                           bcrypt.compare(password,user.password,(err,isMatch)=>{

                               if(err) throw err;
                               if(isMatch){
                                   console.log("True")
                                   return done(null,user);
                               }
                               else
                               {
                                   console.log("False")
                                   return done(null,false,user,{message:'Password Incorrect'})
                               }

                           })
                       })

             }));


passport.serializeUser((user,done)=>{
    done(null,user.id);
})

    passport.deserializeUser((id,done)=>{
        User.findById((id),(err,user)=>{
            done(err,user);
        })
    })

});



