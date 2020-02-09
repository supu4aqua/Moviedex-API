require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIEDEX = require("./moviedex.json");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization");

    if (!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({ error: "Unauthorized request" });
    }
    // move to the next middleware
    next();
});

app.get("/movie", function handleGetMovie(req, res) {
    let response = MOVIEDEX;

    // filter our movie by genre if genre query param is present
    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
        );
    }

    // filter our movie by country if country query param is present
    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.includes(req.query.country)
        );
    }

    // filter our movie by average vote if avg_vote query param is present
    if (req.query.avg_vote) {
        response = response.filter(
            movie => Number(movie.avg_vote) >= Number(req.query.avg_vote)
        );
    }
    //console.log("In movie");
    res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});