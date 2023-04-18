import { movies } from "../models/movies.js";
import { getMovieFromModel, paginate, getVideofromModel, findFilmFollowQuery } from "../services/service.js";

class MovieController {
  trending(req, res) {
    const page = req.query.page ? req.query.page : 1;
    // console.log(page);
    const movieList = movies.all();
    const sortMovie = movieList
      .sort((a, b) => a.popularity - b.popularity)
      .reverse();

      // console.log('sort-movie', sortMovie[0])
    paginate(page, sortMovie, (movies, totalPage) => {
      if (movies) {
        return res.status(200).json({
          results: {
            result: movies,
            page: page,
            total_pages: totalPage,
          },
          message: "ok",
        });
      }
    });
  }

  topRate(req, res) {
    const page = req.query.page ? req.query.page : 1;
    const movieList = movies.all();
    const sortMovie = movieList
      .sort((a, b) => a.vote_average - b.vote_average)
      .reverse();

    paginate(page, sortMovie, (movies, totalPage) => {
      if (movies) {
        return res.status(200).json({
          results: {
            result: movies,
            page: page,
            total_pages: totalPage,
          },
          message: "ok",
        });
      }
    });
  }

  discover(req, res) {
    const params = req.params.genreId;
    const page = req.query.page ? req.query.page : 1;
    if (!params) {
      return res.status(400).json({
        message: "Not found genre param",
        errCode: 1,
      });
    }
    console.log(params);

    getMovieFromModel(params, (results) => {
      if (results !== undefined) {
        paginate(page, results.result, (movies, totalPage) => {
          return res.status(200).json({
            results: {
              result: movies,
              page: page,
              total_page: totalPage,
              genre_name: results.name,
            },
            message: "ok",
          });
        });
      } else {
        res
          .status(400)
          .json({ message: "Not found that genre id", errCode: 1 });
      }
    });
  }

  video(req, res) {
    const videoId = req.params.videoId;
    if (!videoId) {
      return res
        .status(400)
        .json({ message: "Not found film_id param", errCode: 1 });
    }
    getVideofromModel(videoId, (video) => {
      // console.log('video', video)
      if(video !== undefined) {
        return res.status(200).json({
          results: {
            result: video,
          },
          message: 'ok'
        })
      }else {
        res.status(404).json({
          message: 'Not found video',
          errCode: 1,
        });
      };
    });
  };

  search(req, res) {
    const query = req.query.query;
    const advanceSearch = {
      genre: req.query.genre,
      mediaType: req.query.media_type,
      language: req.query.language,
      year: req.query.year,
    }
    console.log('genre', advanceSearch.genre)
    if(!query) {
      return res.status(200).json({
        message: 'Not found keyword param',
        errCode: 1
      })
    };
    findFilmFollowQuery(query, advanceSearch, (movies) => {
      return res.status(200).json({
        results: {
          message: 'ok',
          result: movies
        }
      })
    })
  };

  // middleware user token
  userToken(req, res, next) {
    const token = req.query.api_key;
    const userToken = movies.userToken();
    if(!token) {
      return res.status(401).json({
        message: 'Unauthorized.',
        errCode: 1
      })
    };
    if(userToken.find(item => item.token === token)) {
      return next();
    }else {
      return res.status(200).json({
        message: 'Not found token!',
        errCode: 1
      })
    }
  }
}

export default new MovieController();
