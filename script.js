"use strict";

/* Just a little styling */
const hero__btn = document.querySelector(".hero--btn");
const searchInput = document.querySelector("#search");

hero__btn.addEventListener("click", function () {
  getGeoData();
});

/* API */

// Store coordinates globally
let latitude = null;
let longitude = null;

const logUserLocationAndFetch = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
      }
    );
  } else {
    console.warn("Geolocation not supported");
  }
};
logUserLocationAndFetch();

const getGeoData = async function () {
  let query = searchInput.value;
  if (!query) {
    if (latitude !== null && longitude !== null) {
      query = `${latitude} ${longitude}`;
    } else {
      query = "";
    }
  }
  const url = `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log("OpenStreetMap result:", result);
    // Si on a des résultats, on utilise le premier pour la requête météo
    if (Array.isArray(result) && result.length > 0) {
      const lat = result[0].lat;
      const lon = result[0].lon;
      // Requête vers Open-Meteo
      const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code`;
      try {
        const meteoRes = await fetch(meteoUrl);
        if (!meteoRes.ok) {
          throw new Error(`Open-Meteo response status: ${meteoRes.status}`);
        }
        const meteoData = await meteoRes.json();
        console.log("Open-Meteo result:", meteoData);
      } catch (meteoError) {
        console.error("Open-Meteo error:", meteoError.message);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};
