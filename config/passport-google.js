const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./database');
var mail = require("nodemailer").mail;
//load user model
const User = mongoose.model('users');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
                clientID: keys.googleClientID,
                clientSecret: keys.googleClientSecret,
                callbackURL: '/google-auth/google/callback',
                proxy: true,
                scope: ['profile', 'email']
            }, (accessToken, refreshToken, profile, done) => {
                const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
                console.log(profile);


                //check for existing user
                User.findOne({
                    email: profile.emails[0].value

                })
                    .then((user) => {
                        if (user) {

                            if (user.googleID.length > 0) {

                                console.log("Google User exists");
                                done(null, user);
                            }
                            else {

                                const newUser = new User({
                                    googleID: profile.id,
                                    image: image
                                });
                                newUser.save()
                                    .then((user) => {
                                        done(null, user);
                                    })
                            }

                        }
                        else {
                            //Create user
                            const newUser = new User({
                                googleID: profile.id,
                                email: profile.emails[0].value,
                                image: image,
                                name: profile.displayName,
                                firstUser:true
                            });
                            newUser.save()
                                .then((user) => {

                                    console.log("User not exists");


                                    mail({
                                        from: "noreply@vidjot.com", // sender address
                                        to: "sahtushar@gmail.com", // list of receivers
                                        subject: "Hello ✔", // Subject line
                                        text: "Hello world ✔", // plaintext body
                                        html: "<b>Hello world ✔</b>" // html body
                                    })
                                        .then(()=>{
                                            console.log("successfully sent");
                                        })

                                        .catch(()=>{
                                            console.log("failed");
                                        })


                                    done(null, user);

                                })
                        }
                    })

            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById((id), (err, user) => {
            done(err, user);
        })
    })


};