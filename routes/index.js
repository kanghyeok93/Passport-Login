var express = require('express');
var router = express.Router();
var passport = require('passport');

function authLogin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
    }
}

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', { title : 'passport' , message1 : req.flash('loginMessage') , message2 : req.flash('signupMessage') });
});

router.post('/signup',passport.authenticate('signup',{
    successRedirect : '/success',
    failureRedirect : '/',
    failureFlash : true
}));

router.post('/login',passport.authenticate('login',{
    successRedirect : '/success',
    failureRedirect : '/',
    failureFlash : true
}));

router.get('/success',authLogin,function(req,res,next){
    res.render('success', { title : 'success' });
});

router.get('/kakao', passport.authenticate('kakao-login'));
router.get('/oauth/kakao/callback', passport.authenticate('kakao-login',{
    successRedirect : '/success',
    failureRedirect : '/'
}));

module.exports = router;
