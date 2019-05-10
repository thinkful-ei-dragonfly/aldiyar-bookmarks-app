/* eslint-disable strict */
$.fn.extend({
  serializeJson: function() {
    if (!this.is('form')) throw new TypeError('Must run serializeJson on FORM elements only');
    
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, field) => {
      o[field] = val; 
    });
  
    return JSON.stringify(o);
  }
});