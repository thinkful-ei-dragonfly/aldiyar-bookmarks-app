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
    let expandedContent = '';
    if (item.expanded) {
      expandedContent = `<a href='${item.url}'>Visit site</a>
      <p>${item.desc}</p>`;
    }
    return `
      <li class='item-element js-item-element' data-item-id='${item.id}'>
      ${item.title}
      ${expandedContent}
      <p>Rating ${item.rating}</p>
      <button class="bookmark-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
      <button class="bookmark-expand js-item-expand">
        <span class="button-lanel">expand</span>
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

    if(store.ratingFilter) {
      items = items.filter(item => item.rating>=store.ratingFilter);
    }
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
      console.log('Bookmark created!')
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
        console.log('Item deleted!:(')
    });
  }


  function handleExpandItemClicked() {
    $('.js-bookmarks-list').on('click', '.js-item-expand', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const item = store.findById(id);
      item.expanded = !item.expanded;
      render();
    });
  }

  function handleRatingValueFilter() {
    $('.js-rating-filter').on('submit', event => {
      event.preventDefault();
      const ratingValue = $('#js-filter-value').val();
      store.ratingFilter = ratingValue;
      render();
    });
  }

  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', () => {
      store.setError(null);
      renderError();
    })
  }
  

  function bindEventListeners() {
    handleNewItemSubmit();
    handleDeleteItemClicked();
    handleExpandItemClicked();
    handleRatingValueFilter();
    handleCloseError();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
  
}());