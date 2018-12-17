module.exports=({

    ensureAuthenticated:
        function(req,res,next)
    {
        if(req.isAuthenticated()){
            return next();
        }
        else {
            console.log("not authenticated");
            req.flash('error_msg', "not authenticated");
            res.redirect('/users/login');
        }
}
});