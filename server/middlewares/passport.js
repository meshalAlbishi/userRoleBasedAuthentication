const User = require('../models/User');
const { SECRET } = require('../config/index');
const { Strategy, ExtractJwt } = require('passport-jwt');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
}

module.exports = (passport) => {
    passport.use(new Strategy(opts, async (payload, done) => {
        try {

            let user = await User.findById(payload.user_id);

            return user ? done(null, user) : done(null, false);

        } catch (error) {
            return done(null, false)
        }

    }));
}