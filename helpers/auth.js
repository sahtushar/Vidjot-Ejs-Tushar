module.exports=({

    ensureAuthenticated: function(req,res,next)
    {

        if(req.isAuthenticated()){
            console.log(req.user.firstUser);
            if(req.user.firstUser===false) {
                return next();
            }
            else{
                console.log("set password first");
                req.flash("error_msg","Set Password first")
                res.redirect('/users/setPassword');
            }
        }
        else {
            console.log("not authenticated");
            req.flash('error_msg', "not authenticated");
            res.redirect('/users/login');
        }
}
});