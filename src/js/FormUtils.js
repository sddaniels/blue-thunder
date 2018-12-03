const FormUtils = function() {
  function serializeForm(form) {
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

  function convertFormData(raw) {
    var data = [];
    var previous;

    for (var i = 0; i < raw.length; i++) {
      if ((i % 2) === 0) {
        previous = raw[i];
      } else {
        if (!previous.receiver && !raw[i].amount) continue;
        data.push({
            receiver: previous.receiver,
            amount: raw[i].amount
        });
      }
    }

    return data;
  }

  return {
    serializeForm: serializeForm,
    convertFormData: convertFormData
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = FormUtils;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return FormUtils;
    });
  } else {
    window.FormUtils = FormUtils;
  }
}
