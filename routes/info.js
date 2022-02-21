const router = require('express').Router();
const axios = require('axios');
const parseMoneyAmount = require('../utils/parseMoneyAmount');
const { CommentMovie, User } = require('../db/models');

router.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const response = await axios(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}&language=ru`);
    const filmFromDB = response.data;
    const imgpath = 'https://image.tmdb.org/t/p/w500';
    const genres = filmFromDB.genres.map((genre) => genre.name).join(', ');
    const isLike = !!req.session.user;
    const isAuthorized = !!req.session.user;

    // Find comments
    let comments;
    const commentsFromDb = await CommentMovie.findAll(
      {
        where: {
          movieId,
        },
      },
    );
    if (req.session.user && commentsFromDb.length > 0) {
      comments = [];
      const loginUserId = req.session.user.id;
      for (let i = 0; i < commentsFromDb.length; i += 1) {
        const userId = commentsFromDb[i].UserId;
        // eslint-disable-next-line no-await-in-loop
        const user = await User.findOne({ where: { id: userId } });
        const { username } = user;
        const comment = commentsFromDb[i].text;
        const isCommentByUser = loginUserId === user.id;
        comments.push({
          username, comment, isCommentByUser, movieId, commentId: commentsFromDb[i].id,
        });
      }
    }

    const film = {
      title: filmFromDB.title,
      img: `${imgpath}${filmFromDB.poster_path}`,
      description: filmFromDB.overview,
      date: filmFromDB.release_date,
      budget: parseMoneyAmount(filmFromDB.budget),
      IMDBlink: `https://www.imdb.com/title/${filmFromDB.imdb_id}/?ref_=nv_sr_srsg_0`,
      id: filmFromDB.id,
      rating: filmFromDB.vote_average,
      tagline: filmFromDB.tagline,
      genres,
      isLike,
      comments,
    };

    return res.render('info', { film, isAuthorized });
  } catch (error) {
    console.log(error.message);
    return res.status(500).end();
  }
});

module.exports = router;
