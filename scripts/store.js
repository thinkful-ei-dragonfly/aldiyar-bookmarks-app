/* eslint-disable strict */
const store = (function(){
 
  const addItem = function(item) {
    this.items.push(item);
  }
  
  const setError = function(error) {
    this.error = error;
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };
  
  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };


  return {
    items: [],
    error: null,
    ratingFilter: null,
    adding: null,
    addItem,
    setError,
    findAndDelete,
    findById,
  };
}());