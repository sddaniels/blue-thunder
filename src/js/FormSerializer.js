const formSerializer = function(form) {
	var serialized = [];

	for (var i = 0; i < form.elements.length; i++) {
		var field = form.elements[i];

		if (!field.name || field.disabled || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

		else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      var row = new Object();
      row[field.name] = field.value;
      serialized.push(row);
		}
	}

	return serialized;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = formSerializer;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return formSerializer;
    });
  } else {
    window.formSerializer = formSerializer;
  }
}
