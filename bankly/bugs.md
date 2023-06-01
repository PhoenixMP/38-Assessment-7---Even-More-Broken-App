- Bug #1: the middleware function function authUser (located in middleware/auth.js) doesn't validate the JWT token. Currently, it is saving any decoded jwt (using jwt.decode) rather than only saving valid ones (which would require jwt.verify).

- Bug #2: the model function for User.getAll() (located in models/user.js) returns too much information about the users. Only the basic info is supposed to show, but currently the email and phone number of the users is also showing. 

- Bug #3: the model function for User.get(username) did not have the correct syntax to throw an ExpressError, and was instead was returning a blank object if a user did not exist. 

- Bug #4: The '/:username' route (located in routes/users.js) includes the requireAdmin middleware function, which means that a user must be an admin in order to update a user, and denies access to a user trying to update their own user info. A new middleware function needs to be implimented in its place that instead checks if a user is eitehr an admin or the matching user. 

- Bug #5: There is currently nothing in place to stop a user from updating either forbiddon fields (such as admin status) or non-existing fields. 

- Bug #6: There was no "await" keyword before the User.delete method was called in the '/:username' route (located in routes/users.js). This caused the app to crash whenever there was an error from that method (such as if a nonexisting user was deleted)