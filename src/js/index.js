import Masspay from './Masspay';
import FormUtils from './FormUtils';
import MoneyUtils from './MoneyUtils';
import Events from './Events';
import Display from './Display';

(function () {
  const KEY_A = 65;
  const INVALID_RECEIVER = 'Cannot send to this receiver, unknown email address.';
  const INVALID_AMOUNT = 'Invalid amount.';

  var mp = Masspay();
  var events = Events();
  var display = Display();
  var receiverDebounceTimer;

  function createInput(name) {
    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', name);
    return input;
  }

  function addRow() {
    var table = document.getElementById('js-table');

    var newRow = table.insertRow(table.rows.length);
    var receiver = newRow.insertCell(0);
    var amount = newRow.insertCell(1);

    receiver.classList.add('masspay__cell');
    receiver.appendChild(createInput('receiver'));

    amount.classList.add('masspay__cell');
    amount.classList.add('masspay__amt-cell');
    amount.appendChild(createInput('amount'));
  }

  function displayError(text) {
    var message = document.getElementById('js-error-message');
    if (!!text) {
      message.innerHTML = text;
    } else {
      message.innerHTML = 'Please fix the errors below:';
    }
  }

  function hideValidationError(target) {
    var existingError = target.querySelector('.validation-error');
    if (existingError) {
      target.removeChild(existingError);
    }
  }

  function showValidationError(target, text) {
    var validationError = document.createElement('span');
    validationError.classList.add('validation-error');
    validationError.appendChild(document.createTextNode(text));
    target.appendChild(validationError);
  }

  function validateReceiver(event) {
    hideValidationError(event.target.parentNode);

    if (!event.target.value) return;

    mp.isValidReceiver(event.target.value).then(function(result) {
      if (!result) {
        showValidationError(event.target.parentNode, INVALID_RECEIVER);
      }
    });
  }

  function displayCellError(result, cellIndex, text) {
    var table = document.getElementById('js-table');
    var cell = table.rows[result.item + 1].cells[cellIndex];
    hideValidationError(cell);
    showValidationError(cell, text);
    displayError();
  }

  function handleSubmitError(result) {
    switch (result.error) {
      case 'empty':
        displayError('Please enter at least one item.');
        break;

      case 'invalidReceiver':
        displayCellError(result, 0, INVALID_RECEIVER);
        break;

      case 'invalidAmount':
        displayCellError(result, 1, INVALID_AMOUNT);
        break;

      default:
        displayError('There was a problem submitting your masspay.');
    }
  }

  events.handleClick('#js-submit', function(event) {
    event.preventDefault();

    var util = FormUtils();
    var form = document.getElementById('js-masspay-form');
    var data = util.convertFormData(util.serializeForm(form));

    mp.submit(data).then(function(result) {
      var error = document.getElementById('js-error-summary');

      if (result.success) {
        display.show('js-success');
        display.hide('js-header');
        display.hide('js-masspay');
        display.hide(error);
      } else {
        display.show(error);
        handleSubmitError(result);
      }
    });
  });

  events.handleClick('#js-add', function(event) {
    event.preventDefault();
    addRow();
  });

  events.handleClick('#js-create-another', function(event) {
    event.preventDefault();

    var table = document.getElementById('js-table');
    var rowCount = table.rows.length;
    for (var i = 0; i < rowCount - 2; i++) {
      table.deleteRow(-1);
    }

    document.getElementById('js-masspay-form').reset();
    display.hide('js-success');
    display.show('js-header');
    display.show('js-masspay');
  });

  events.handleKeyup('input[name="amount"]', function(event) {
    hideValidationError(event.target.parentNode);

    if (!!event.target.value && !mp.isValidAmount(event.target.value)) {
      showValidationError(event.target.parentNode, INVALID_AMOUNT);
    }

    var util = MoneyUtils();
    var amounts = document.querySelectorAll('input[name="amount"]');

    var totalElements = document.querySelectorAll('.js-total');

    for (var i = 0; i < totalElements.length; i++) {
      totalElements[i].innerHTML = util.totalAmounts(amounts);
    }
  });

  events.handleKeyup('input[name="receiver"]', function(event) {
    clearTimeout(receiverDebounceTimer);
    receiverDebounceTimer = setTimeout(function() {
        validateReceiver(event);
    }, 750);
  });

  events.handleKeyup(':not(input)', function(event) {
    if (event.which === KEY_A) {
      addRow();
    }
  });
})();
