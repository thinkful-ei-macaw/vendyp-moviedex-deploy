require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies-data-small.json');
const { NODE_ENV } = require('./config');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const morganSetting = NODE_ENV === 'production' ? 'tiny' :'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use((error, req, res, next) => {
  let response;
  console.log(error);
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

app.get('/movie', (req,res)=>{
  let moviesList = [...movies];
  let { genre, country}   = req.query;
  

  if(genre){
    genre=genre.toLowerCase();
    moviesList = moviesList.filter(movie =>{
      return movie.genre.toLowerCase().includes(genre);
    });
  }
  if(country){
    country=country.toLowerCase();
    moviesList = moviesList.filter(movie =>{
      return movie.country.toLowerCase().includes(country);
    });
  }
  res.json(moviesList);
});


module.exports = app;