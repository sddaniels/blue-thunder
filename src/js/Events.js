const Events = function() {
  function addEventListener(event, selector, callback) {
    document.addEventListener(event, function(event) {
      if (!event.target.matches(selector)) return;
      callback(event);
    });
  }

  function handleClick(selector, callback) {
    addEventListener('click', selector, callback);
  }

  function handleKeyup(selector, callback) {
    addEventListener('keyup', selector, callback);
  }

  return {
    handleClick: handleClick,
    handleKeyup: handleKeyup
  };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Events;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Events;
    });
  } else {
    window.Events = Events;
  }
}
