const passport = require("passport");
module.exports = app =>{
  app.get('/',(req,res)=>{
    res.send(req.user.id);
  });
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.post('/login',
    passport.authenticate('login', { failureRedirect: '/failed' }),
    function(req, res) {
      res.redirect('/');
  });

  app.post('/register',
  passport.authenticate('register', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/');
});


};
