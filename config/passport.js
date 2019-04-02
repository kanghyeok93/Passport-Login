var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var KakaoStrategy = require('passport-kakao').Strategy;

module.exports = function(passport){

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
       User.findById(id,function(err,user){
           done(err,user);
       })
    });

    passport.use('signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'email' : email }, function(err, user) {
                if (err) return done(err);
                if (user) {
                    return done(null, false, req.flash('signupMessage', '이메일이 존재합니다.'));
                } else {
                    var newUser = new User();
                    newUser.name = req.body.name;
                    newUser.email = email;
                    newUser.password = newUser.createHash(password);
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        }));

    passport.use('login',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
        User.findOne({'email' : email},function(err,user){
            if(err) return done(err);
            if(!user){
                return done(null,false,req.flash('loginMessage','사용자를 찾을 수 없습니다.'));
            }
            if(!user.comPassword(password)){
                return done(null,false,req.flash('loginMessage','비밀번호가 다릅니다.'));
            }
            return done(null,user);
        })
    }));

    passport.use('kakao-login', new KakaoStrategy({
            clientID: '82449624311132dd893b2e5d94f98188',
            clientSecret: 'SgMLAu8zJF6g9i0bniN5bgaPoFVSN41y',
            callbackURL: 'http://localhost:3000/oauth/kakao/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            return done(null, profile);
        }));
};