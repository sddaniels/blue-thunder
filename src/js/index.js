import Masspay from './Masspay';
import FormUtils from './FormUtils';
import MoneyUtils from './MoneyUtils';

(function () {
  const INVALID_RECEIVER = 'Cannot send to this receiver, unknown email address.';
  const INVALID_AMOUNT = 'Invalid amount.';

  var mp = Masspay();
  var receiverDebounceTimer;

  function addRow() {
    var table = document.getElementById('js-table');

    var newRow = table.insertRow(table.rows.length);
    var receiver = newRow.insertCell(0);
    var amount = newRow.insertCell(1);

    receiver.classList.add('masspay__cell');
    var receiverInput = document.createElement('input');
    receiverInput.setAttribute('type', 'text');
    receiverInput.setAttribute('name', 'receiver');
    receiver.appendChild(receiverInput);

    amount.classList.add('masspay__cell');
    amount.classList.add('masspay__amt-cell');
    var amountInput = document.createElement('input');
    amountInput.setAttribute('type', 'text');
    amountInput.setAttribute('name', 'amount');
    amount.appendChild(amountInput);
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

  function handleSubmitError(result, cellIndex, text) {
    var table = document.getElementById('js-table');
    var cell = table.rows[result.item + 1].cells[cellIndex];
    hideValidationError(cell);
    showValidationError(cell, text);
    displayError();
  }

  document.addEventListener('click', function(event) {
    if (!event.target.matches('#js-submit')) return;

    event.preventDefault();

    var util = FormUtils();
    var form = document.getElementById('js-masspay-form');
    var data = util.convertFormData(util.serializeForm(form));

    mp.submit(data).then(function(result) {
      var error = document.getElementById('js-error-summary');

      if (result.success) {
        var success = document.getElementById('js-success');
        var masspay = document.getElementById('js-masspay');
        success.style.display = 'block';
        error.style.display = 'none';
        masspay.style.display = 'none';
      } else {
        error.style.display = 'block';

        switch (result.error) {
          case 'empty':
            displayError('Please enter at least one item.');
            break;

          case 'invalidReceiver':
            handleSubmitError(result, 0, INVALID_RECEIVER);
            break;

          case 'invalidAmount':
            handleSubmitError(result, 1, INVALID_AMOUNT);
            break;

          default:
            displayError('There was a problem submitting your masspay.');
        }
      }
    });
  });

  document.addEventListener('click', function(event) {
    if (!event.target.matches('#js-add')) return;
    event.preventDefault();

    addRow();
  });

  document.addEventListener('click', function(event) {
    if (!event.target.matches('#js-create')) return;
    event.preventDefault();

    var table = document.getElementById('js-table');
    var rowCount = table.rows.length;
    for (var i = 0; i < rowCount - 2; i++) {
      table.deleteRow(-1);
    }

    document.getElementById('js-masspay-form').reset();

    var success = document.getElementById('js-success');
    var masspay = document.getElementById('js-masspay');
    success.style.display = 'none';
    masspay.style.display = 'block';
  });

  document.addEventListener('keyup', function(event) {
    if (!event.target.matches('input[name="amount"]')) return;

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

  document.addEventListener('keyup', function(event) {
    if (!event.target.matches('input[name="receiver"]')) return;

    clearTimeout(receiverDebounceTimer);
    receiverDebounceTimer = setTimeout(function() {
        validateReceiver(event);
    }, 750);
  });

  document.addEventListener('keyup', function(event) {
    if (!event.target.matches('input') && event.which === 65) {
      addRow();
    }
  });
})();
