"use strict";

/* Just a little styling */
const hero__btn = document.querySelector(".hero--btn");
const searchInput = document.querySelector("#search");

hero__btn.addEventListener("click", function () {
  this.classList.toggle("clided");
  getData();
});

/* API */
async function getData() {
  const query = searchInput.value || "pilkington avenue,birmingham"; // Valeur par défaut si le champ est vide
  const url = `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    // Traitez les résultats ici, par exemple, affichez les coordonnées ou mettez à jour l'interface
  } catch (error) {
    console.error(error.message);
  }
}
