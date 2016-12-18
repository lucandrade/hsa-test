import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export default app => {
    const User = app.datasource.models.User;
    const opts = {};
    opts.secretOrKey = app.config.jwt.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();

    const strategy = new Strategy(opts, (payload, done) => {
        User.findById(payload.id)
            .then(user => {
                if (user) {
                    return done(null, {
                        id: user._id,
                        email: user.email,
                    });
                }
                return done(null, false);
            })
            .catch(err => done(err, null));
    });

    passport.use(strategy);
    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', app.config.jwt.session),
    };
};
