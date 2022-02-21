const router = require('express').Router();
const axios = require('axios');
const translate = require('translate-google');
const getMovieObjectToRender = require('../utils/getMovieObjectToRender');

let filmsResult = [];

router.get('/', (req, res) => {
  try {
    if (req.session.user) {
      const isAuthorized = !!req.session.user;
      return res.render('search', { isAuthorized });
    }
    return res.render('search');
  } catch (error) {
    console.log(error.message);
    return res.status(500).end();
  }
});

router.get('/results', async (req, res) => {
  try {
    if (req.session.user) {
      const isAuthorized = !!req.session.user;
      return res.render('results', {
        isAuthorized,
        filmsResult,
        resultTitle: 'Результаты поиска',
      });
    }
    return res.render('results', {
      filmsResult,
      resultTitle: 'Результаты поиска',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).end();
  }
});

router.route('/byName').post(async (req, res) => {
  try {
    const { filmInput } = req.body;

    const films = await translate(filmInput, { from: 'ru', to: 'en' });

    const response = await axios(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=ru&page=1&include_adult=false&query=${films}`,
    );

    const filmsFromDB = response.data.results;

    filmsResult = filmsFromDB.map((film) => getMovieObjectToRender(film, res.locals.isAuth));

    res.status(200).json({ didFindResults: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).end();
  }
});

router.route('/byType').post(async (req, res) => {
  try {
    const { type } = req.body;

    const response = await axios(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${process.env.API_KEY}&language=ru`
    );
    const filmsFromDB = response.data.results;

    filmsResult = filmsFromDB.map((film) => getMovieObjectToRender(film, res.locals.isAuth));

    res.status(200).json({ didFindResults: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).end();
  }
});

module.exports = router;
