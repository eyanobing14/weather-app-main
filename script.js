"use strict";
const hero__btn = document.querySelector(".hero--btn");
hero__btn.addEventListener("click", function () {
  this.classList.toggle("clided");
});
