const express = require('express');
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
require('dotenv').config();

const { main, cookiesCleaner } = require('./middleware/index');

const mainRouter = require('./routes/main');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const searchRouter = require('./routes/search');
const infoRouter = require('./routes/info');

const app = express();
const PORT = process.env.PORT ?? 4000;

const sessionConfig = {
  store: new FileStore(),
  key: 'user_sid',
  secret: `${process.env.SECRET_WORD}`,
  resave: true,
  saveUninitialized: false,
  cookie: {
    expires: 1000 * 60 * 60 * 12,
    httpOnly: true,
  },
};

app.set('view engine', 'hbs');
hbs.registerPartials(path.resolve(process.cwd(), 'views', 'partials'));

app.use(session(sessionConfig));
app.use(cookieParser());
app.use(cookiesCleaner);
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use(main);

app.use('/main', mainRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/search', searchRouter);
app.use('/info', infoRouter);

app.listen(PORT, () => console.log(`*Server started at http://localhost:${PORT}`));
