/* eslint-disable strict */
/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const bookmarksList = (function(){

  function generateError(message) {
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    return `
      <li class='js-item-element' data-item-id='${item.id}'>
      ${item.title}
      <p>Rating ${item.rating}</p>
      <a href='${item.url}' class='hidden'>Visit site</a>
      <p>${item.desc}</p>
      <button class="bookmark-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
    </li>`;
  }

  function generateBookmarksListString(bookmarksList) {
    const items = bookmarksList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function renderError() {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  }

  function render() {
    renderError();
    let items = [ ...store.items ];
    console.log('`render` ran');
    const bookmarksListString = generateBookmarksListString(items);
    $('.js-bookmarks-list').html(bookmarksListString);
  }

  function handleNewItemSubmit() {
    $('.js-form').submit(function (event) {
      event.preventDefault();
      const NewItemTitle =$('#js-title').val();
      const newItemURL = $('#js-url').val();
      const newItemDesc = $('#js-desc').val();
      const newItemRating = $('#js-rating').val();
      console.log(NewItemTitle)
      console.log(newItemURL)
      console.log(newItemDesc)
      console.log(newItemRating)
      const Item = {
        title: NewItemTitle,
        url: newItemURL,
        desc: newItemDesc,
        rating: parseInt(newItemRating, 10),
      };
      api.createItem(Item)
        .then((newItem)=> {
          store.addItem(newItem);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });

    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }

  function handleDeleteItemClicked() {
    $('.js-bookmarks-list').on('click', '.js-item-delete', event => {
      const id =getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      api.deleteItem(id)
        .then(() => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        });
    });
  }


  function bindEventListeners() {
    handleNewItemSubmit();
    handleDeleteItemClicked();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
  
}());