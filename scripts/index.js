/* eslint-disable strict */
$(document).ready(function() {
  bookmarksList.bindEventListeners();

  // On initial load, fetch Shopping Items and render
  api.getItems()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarksList.render();
    })
    .catch(err => console.log(err.message));
});

