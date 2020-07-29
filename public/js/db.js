// enable offline data
db.enablePersistence().catch(function (err) {
  if (err.code == "failed-precondition") {
    // probably multible tabs open at once
    console.warn("persistance failed");
  } else if (err.code == "unimplemented") {
    // lack of browser support for the feature
    console.warn("persistance not available");
  }
});

//Realtimr listener
db.collection("recipes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    //console.log(change.type, change.doc.id, change.doc.data());
    if (change.type === "added") {
      // add the document data to the web page
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      // remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

//Delete Recipe
const recipeContainer = document.querySelector(".recipes");

recipeContainer.addEventListener("click", (evt) => {
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    db.collection("recipes").doc(id).delete();
  }
});
