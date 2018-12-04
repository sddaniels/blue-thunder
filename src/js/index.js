import Masspay from './Masspay';
import FormUtils from './FormUtils';
import MoneyUtils from './MoneyUtils';

(function () {
  var mp = Masspay();
  var receiverDebounceTimer;

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
        console.log(result);
      }
    });
  });

  document.addEventListener('click', function(event) {
    if (!event.target.matches('#js-add')) return;
    event.preventDefault();

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

    var existingError = event.target.parentNode.querySelector('.validation-error');
    if (existingError) {
      event.target.parentNode.removeChild(existingError);
    }

    if (!!event.target.value && !mp.isValidAmount(event.target.value)) {
      var validationError = document.createElement('span');
      validationError.classList.add('validation-error');
      validationError.appendChild(document.createTextNode('Invalid amount.'));
      event.target.parentNode.appendChild(validationError);
    }

    var util = MoneyUtils();
    var amounts = document.querySelectorAll('input[name="amount"]');

    var totalElements = document.querySelectorAll('.js-total');

    for (var i = 0; i < totalElements.length; i++) {
      totalElements[i].innerHTML = util.totalAmounts(amounts);
    }
  });

  function validateReceiver(event) {
    var existingError = event.target.parentNode.querySelector('.validation-error');
    if (existingError) {
      event.target.parentNode.removeChild(existingError);
    }

    if (!event.target.value) return;

    mp.isValidReceiver(event.target.value).then(function(result) {
      if (!result) {
        var validationError = document.createElement('span');
        validationError.classList.add('validation-error');
        validationError.appendChild(document.createTextNode('Cannot send to this receiver, unknown email address.'));
        event.target.parentNode.appendChild(validationError);
      }
    });
  }

  document.addEventListener('keyup', function(event) {
    if (!event.target.matches('input[name="receiver"]')) return;

    clearTimeout(receiverDebounceTimer);
    receiverDebounceTimer = setTimeout(function() {
        validateReceiver(event);
    }, 750);
  });
})();
