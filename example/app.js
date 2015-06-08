var passport = require('passport'),
	express = require('express'),
	StreamMeStrategy = require('../index');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use('streamme', 
	new StreamMeStrategy({
		authorizationURL: 'https://www.stream.me/api-auth/authorize',
		tokenURL: 'https://www.stream.me/api-auth/token',
		clientID: '',
		clientSecret: '',
		callbackURL: '',
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
		  return done(null, profile);
		});
	}
));

var app = express();
app.use(passport.initialize());
app.use(passport.session());
app.get('/', passport.authenticate('streamme', { scope: ['account'] }));

app.get('/redirect', passport.authenticate('streamme', {
	scope: ['account'], 
	failureRedirect: '/login' 
}), function(req, res) {
	res.send(req.user);
});

app.listen(8888, function(err) {
	if(err) {
		console.error(err);
		process.exit(1)
	}
	console.log('server started');
});
