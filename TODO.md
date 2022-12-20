## General functional programming tasks
- [x] Create wrapper function to take options and either secret or RSA private key to generate JWT.
- [x] Create wrapper function to take options and verify/decode a JWT.
- [x] Create tests to check for invalid signing secret or RSA key.
- [x] Create a test to check for invalid signing algorithm.
- [x] Create a test to check for invalid subject claim.
- [x] Create a test to check for invalid issuer claim.
- [x] Create a test to check for invalid audience claim.
- [x] Create a test to check for expired token.
- [x] Create a test to check for malform tokens.
- [-] Integrate with the users npm package to automtically issue / verify tokens.
- [ ] Add a function to generate an admin token - for authorizing admin level tasks.

## ES6 Mft class definition tasks
- [ ] constructor: create a class constructor method to initialize Mft class
- [ ] init: method to perform asynchronous operations after initialization
- [ ] - check environment variables for key pairs
- [ ] - set array of found key pairs, by type (access, identity, admin, user, etc.)
- [ ] - add unit tests to valid instance creation 
- [ ] 
