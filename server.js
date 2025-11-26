const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const ejs = require("ejs");
const axios = require("axios");
dotenv.config();

const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "views")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${process.env.API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      res.render("index", {
        movies: response.data.results,
        type: "Latest Movies",
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("index", { movies: [] });
    });
});

app.get("/search", (req, res) => {
  const query = req.query.query;
  const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&query=${query}&api_key=${process.env.API_KEY}`;
  axios
    .get(url)
    .then((response) => {
      res.render("index", {
        movies: response.data.results,
        type: `Showing results for ${query}`,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/recommend", (req, res) => {
  res.render("recommend");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
