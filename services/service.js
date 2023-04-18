import { movies } from "../models/movies.js";

export const getMovieFromModel = (params, cb) => {
  const movieList = movies.all();
  const listGenre = movies.genreList();
  let results;
  listGenre.filter((item) => {
    if (+params === item.id) {
      const movies = movieList.map((movie) => {
        if (movie.genre_ids.find((p) => p === item.id)) {
          return movie;
        }
      });
      results = {
        result: movies.filter((item) => {
          if (item !== undefined) {
            return item;
          }
        }),
        name: item.name,
      };
    }
  });
  cb(results);
};

export const paginate = (page, results, cb) => {
  const limit = 20;
  const start = (page - 1) * limit;
  const end = page * limit;
  const movies = results.slice(start, end);
  const totalPage = Math.ceil(results.length / limit);

  cb(movies, totalPage);
};

export const getVideofromModel = (params, cb) => {
  const videoList = movies.videoList();
  let results;
  videoList.filter((item) => {
    if (item.id === +params) {
      const filterVideo = item.videos.map((item) => {
        if (item.official && item.site === "YouTube") {
          const typeVideo = item.name.includes("Trailer")
            ? item.name.includes("Trailer")
            : item.name.includes("Teaser");
          if (typeVideo) {
            // cb(item);
            return item;
          }
        }
      });
      const result = filterVideo.filter((item) => item !== undefined);
      const timeTemp = result.map((d) =>
        Math.abs(new Date() - new Date(d.published_at).getTime())
      );
      const index = timeTemp.indexOf(Math.min(...timeTemp));
      results = filterVideo[index];
    }
  });
  cb(results);
};

export const findFilmFollowQuery = (query, advanceSearch, cb) => {
  const movieList = movies.all();
  const { genre, mediaType, language, year } = advanceSearch;
  let result;
  const searchTitle = movieList.filter((item) => {
    const name = item.title
      ? item.title.toLowerCase()
      : item.name.toLowerCase();
    // console.log('name', name)
    const formatQuery = query.toLowerCase();
    if (name.includes(formatQuery)) {
      return item;
    }
  });
  result = searchTitle;

  const searchWithGenre = [];
  if (genre) {
    const genreList = movies.genreList();
    const genreName = genreList.filter((item) => {
      if (item.name.toLowerCase() === genre.toLowerCase()) {
        return item;
      }
    });
    console.log('genre', genreName[0].id)
    searchTitle.filter((movie) => {
      movie.genre_ids.filter((item) => {
        console.log('id-genre', item)
        if (item === genreName[0].id) {
          searchWithGenre.push(movie);
        }
      });
    });
    console.log('genre', searchWithGenre)

    result = searchWithGenre;
  }

  let searchWithType = [];
  if (mediaType) {
    const typeList = movies.mediaTypeList();
    const totalMovie =
      searchWithGenre.length > 0 ? searchWithGenre : searchTitle;
    // console.log('total',totalMovie)
    const keyword = typeList.filter((item) => {
      if (item.toLowerCase() === mediaType.toLowerCase()) {
        return item;
      }
    });
    if (keyword[0] === "all") {
      searchWithType = totalMovie;
    } else {
      totalMovie.filter((item) => {
        // console.log('type', item.media_type)
        if (item.media_type === keyword[0]) {
          searchWithType.push(item);
        }
      });
    }
    result = searchWithType;
  }

  const searchWithLanguage = [];
  if (language) {
    const totalMovie = searchWithType.length > 0 ? searchWithType : searchTitle;
    totalMovie.filter((item) => {
      if (item.original_language === language) {
        searchWithLanguage.push(item);
      }
    });
    result = searchWithLanguage;
  }

  const searchWithYear = [];
  if (year) {
    const totalMovie =
      searchWithLanguage.length > 0 ? searchWithLanguage : searchTitle;
    totalMovie.filter((item) => {
      // let d = new Date(item.release_date)
      // let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const date = item.release_date ? item.release_date : item.first_air_date;
      if (date.slice(0, 4) === year) {
        searchWithYear.push(item);
      }
    });
    result = searchWithYear;
  }

  cb(result);
};
