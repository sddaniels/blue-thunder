const Display = function() {
  function changeDisplayStyle(target, style) {
    if (typeof target === 'string') {
      document.getElementById(target).style.display = style;
    } else {
      target.style.display = style;
    }
  }

  function show(target) {
    changeDisplayStyle(target, 'block');
  }

  function hide(target) {
    changeDisplayStyle(target, 'none');
  }

  return {
    show: show,
    hide: hide
  };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Display;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Display;
    });
  } else {
    window.Display = Display;
  }
}
