const router = require('express').Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    const isAuthorized = !!req.session.user;
    return res.render('main', { isAuthorized });
  }
  return res.render('main');
});

router.route('/logout').get((req, res) => {
  const { user } = req.session;

  if (user) {
    req.session.destroy();

    res.clearCookie('user_sid');

    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});
module.exports = router;
