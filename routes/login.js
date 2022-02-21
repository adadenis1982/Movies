const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

router
  .route('/')
  .get((req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;

      console.log(req.cookies);

      res.status(200).json({ login: true });
    } else {
      res.status(400).json({ message: 'Вам необходимо зарегистрироваться или Вы ввели неверные данные' });
    }
  });

module.exports = router;
