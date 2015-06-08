var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your StreamMe application's client id
 *   - `clientSecret`  your StreamMe application's client secret
 *   - `callbackURL`   URL to which StreamMe will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new StreamMeStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/streamme/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
var Strategy = module.exports = function(options, verify) {
	options = options || {};
	options.authorizationURL = options.authorizationURL;
	options.tokenURL = options.tokenURL;

	OAuth2Strategy.call(this, options, verify);
	this._oauth2._useAuthorizationHeaderForGET = true;
	this.name = 'streamme';	
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from StreamMe
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `streamme`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	this._oauth2.get('https://www.stream.me/api-user/v1/me', accessToken, function (err, body, res) {
		if (err) {
			return done(new InternalOAuthError('failed to fetch user profile', err));
		}

		if(res.statusCode !== 200) {
			return done(new InternalOAuthError('unexpected status code ' + res.statusCode, body));
		}

		try {
			var json = JSON.parse(body);
			var profile = { provider: 'streamme' };
			profile.id = json.id;
			profile.displayName = json.displayName;

			profile._raw = body;
			profile._json = json;

			done(null, profile);
		} catch(e) {
			done(e);
		}
	});
};
