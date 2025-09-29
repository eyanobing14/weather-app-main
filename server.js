const express = require("express");
const fetch = require("node-fetch");
const app = express();

// Middleware pour ajouter les en-têtes CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Route proxy pour l'API Nominatim
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=jsonv2`;
  console.log(`Fetching URL: ${url}`); // Log the URL for debugging
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WeatherApp/1.0 ", // Replace with your real email
      },
    });
    console.log(`Response status: ${response.status}`); // Log the response status
    if (!response.ok) {
      throw new Error(
        `Nominatim API responded with status: ${response.status}`
      );
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(`Error in /api/search: ${error.message}`); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// Servir les fichiers statiques (votre HTML, CSS, JS)
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
