/* eslint-disable strict */
const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/aldibatyr';

  /**
   * listApiFetch - Wrapper function for native `fetch` to standardize error handling. 
   * @param {string} url 
   * @param {object} options 
   * @returns {Promise} - resolve on all 2xx responses with JSON body
   *                    - reject on non-2xx and non-JSON response with 
   *                      Object { code: Number, message: String }
   */
  const listApiFetch = function(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = { code: res.status };
          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }
        return res.json();
      })
      .then(data => {
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
        return data;
      });
  };
  const getItems = function() {
    return listApiFetch(BASE_URL + '/bookmarks');
  };

  
  const createItem = function(item) {
    const newItemJson = JSON.stringify(item);
    return listApiFetch(BASE_URL + '/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: newItemJson
    });
  };

  const deleteItem = function(id) {
    return listApiFetch(BASE_URL + '/bookmarks/' + id, {
      method: 'DELETE'
    });
  };
  return {
    getItems,
    createItem,
    deleteItem,
  };



}());