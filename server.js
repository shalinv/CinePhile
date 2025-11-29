const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const ejs = require("ejs");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
dotenv.config();

const PORT = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "views")));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

app.use(express.json());

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

app.post("/suggest", async (req, res) => {
  const data = req.body;
  const prompt = `
  You are a movie-recommendation AI.

Given the following three input movies:
1. ${data.movie1}
2. ${data.movie2}
3. ${data.movie3}

Generate exactly 10 movie recommendations that are similar in genre, tone, themes, or audience appeal.

Your output MUST follow these rules:
- Output ONLY valid JSON.
- The JSON must be an array of 10 objects.
- Each object must contain only one key: "title".
- The value of "title" must be the recommended movie’s name.
- Do NOT include explanations, descriptions, or any text outside the JSON structure.

Example output format:
[
  { "title": "Example Movie 1" },
  { "title": "Example Movie 2" },
  ...
]
Give the output in one line
Do not add any symbols like newline + * / ' '''
  `;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const output = response.candidates[0].content.parts[0].text;
    const recommendation = JSON.parse(output);

    const searchTMDB = async (title) => {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.API_KEY
      }&query=${encodeURIComponent(title)}&include_adult=false`;
      const resp = await axios.get(url);
      const movie = resp.data.results[0];
      return movie;
    };

    const finalMovies = [];

    for (const { title } of recommendation) {
      if (finalMovies.length >= 10) break;
      const movie = await searchTMDB(title);
      if (movie) finalMovies.push(movie);
    }
    return res.json(finalMovies);
  } catch (error) {
    console.error("Error generating content:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
