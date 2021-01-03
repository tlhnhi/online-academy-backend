import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import Middlewares from './api/middlewares';
import Authentication from './api/authentication';

import UserRouter from './user/router';
import CategoryRouter from './category/router';
import AdminCourseRouter from './course/routers/admin';
import EnrollCourseRouter from './course/routers/userEnroll';
import FavoriteCourseRouter from './course/routers/userFavorite';

if (!process.env.JWT_SECRET) {
    const err = new Error('No JWT_SECRET in env variable');
    console.error(err);
}

const app = express();

mongoose.connect(config.mongoose.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.catch(err => console.error(err));

mongoose.Promise = global.Promise;

// App Setup
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res) => res.json({'connect': 'success'}));
app.post('/signup', Authentication.signup);
app.post('/signin', Authentication.signin);
app.get('/auth-ping', Middlewares.loginRequired, (req, res) => res.json({ 'success': true }));

app.use('/user', Middlewares.loginRequired, UserRouter);
app.use('/category', CategoryRouter);
app.use('/course/enroll', Middlewares.loginRequired, EnrollCourseRouter);
app.use('/course/favorite', Middlewares.loginRequired, FavoriteCourseRouter);
app.use('/course', AdminCourseRouter);

app.use((err, req, res, next) => {
    console.log('Error:', err.message);
    res.status(422).json({
        success: false,
        message: err.message
    });
});

// Server Setup
const port = process.env.PORT || 8000
http.createServer(app).listen(port, () => {
    console.log(`\x1b[32m`, `Server listening on: ${port}`, `\x1b[0m`)
});
