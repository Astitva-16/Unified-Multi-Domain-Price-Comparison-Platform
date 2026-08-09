require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const searchRoutes = require("./routes/search");

const imageSearchRoutes =
  require("./routes/imageSearch");


const app = express();

const PORT =
  process.env.PORT || 5000;


const distPath =
  path.join(
    __dirname,
    "../frontend/price-prism/dist"
  );


const hasFrontendBuild =
  fs.existsSync(distPath);


app.use(cors());

app.use(express.json());


app.use(
  "/api",
  searchRoutes
);


app.use(
  "/api/image-search",
  imageSearchRoutes
);


if (hasFrontendBuild) {

  app.use(
    express.static(distPath)
  );


  app.get(
    "*",
    (req, res, next) => {

      if (
        req.path.startsWith("/api")
      ) {
        return next();
      }

      res.sendFile(
        path.join(
          distPath,
          "index.html"
        )
      );

    }
  );

} else {

  app.get(
    "/",
    (req, res) => {

      res.json({
        message:
          "MOL BHAO Backend API running",
      });

    }
  );

}


app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );

    console.log(
      "🔑 Gemini API Key loaded:",
      !!process.env.GEMINI_API_KEY
    );

  }
);


module.exports = app;