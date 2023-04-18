import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const genreList = path.join(__dirname, 'data/genreList.json');
const mediaTypeList = path.join(__dirname, 'data/mediaTypeList.json');
const movieList = path.join(__dirname, 'data/movieList.json');
const userToken = path.join(__dirname, 'data/userToken.json');
const videoList = path.join(__dirname, 'data/videoList.json');


export const movies = {
  genreList: function() {
    return JSON.parse(fs.readFileSync(genreList, 'utf8'));
  },
  mediaTypeList: function() {
    return JSON.parse(fs.readFileSync(mediaTypeList, 'utf8'));
  },
  all: function() {
    return JSON.parse(fs.readFileSync(movieList, 'utf8'));
  },
  userToken: function() {
    return JSON.parse(fs.readFileSync(userToken, 'utf8'));
  },
  videoList: function() {
    return JSON.parse(fs.readFileSync(videoList, 'utf8'));
  },
}