const passport = require("passport");
const Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = app => {
    const Users = app.db.models.Users;
    const config = app.libs.config;
    const opt = {
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    passport.use(new Strategy(
        opt, 
        function(payload, done){
            Users.findByPk(payload.id)
            .then(user => {
                if(user){
                    return done(null, {
                        id: user.id,
                        email: user.email
                    });
                }

                return done(null, false);
            })
            .catch(error => done(error, null))
        }
    ));

    return {
        initialize: function(){
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate("jwt", config.jwtSession);
        }
    };
};