import express from 'express';

import movieController from '../controllers/movieController.js';

const router = express.Router();

const initRoute = (app) => {
  // Middleware user token
  app.use(movieController.userToken);

  // router pages
  router.get('/api/movies/trending', movieController.trending);
  router.get('/api/movies/top-rate', movieController.topRate);
  router.get('/api/movies/discover/:genreId', movieController.discover);
  router.get('/api/movies/video/:videoId', movieController.video);
  router.get('/api/movies/search', movieController.search);

  return app.use('/', router);
};

export default initRoute;
