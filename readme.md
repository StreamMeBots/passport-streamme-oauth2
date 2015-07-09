# Passportjs Straegy for ouath2 integration with StreamMe.

<img src="https://static1.stream.me/web/active/images/robot-avatar.png" width=30px; style="display= inline-block" />

## Alpha

Currently oauth clients are in alpha.  Please contact support@stream.me staff for an oauth client

## Installation

```bash
$ npm install passport-streamme-oauth2
```

## Usage

```javascript
passport.use(
	new StreamMeStrategy({
		clientID: streammeClientId,
		clientSecret: streammeClientSecret,
		callbackURL: 'http://localhost/redirect'
	}, function(accessToken, refreshToken, profile, done) {

		// Save your user and accessToken

		done(null, profile);
	})
);

app.get('/', passport.authenticate('streamme', {
	scope: ['account']
}));

app.get('/redirect', passport.authenticate('streamme', {
	scope: ['account']
}), function(req, res) {
	res.send(req.user);
});
```
