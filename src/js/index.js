import Masspay from './Masspay';
import FormUtils from './FormUtils';
import MoneyUtils from './MoneyUtils';

(function () {
  var mp = Masspay();

  document.addEventListener('click', function(event) {
    if (!event.target.matches('#js-submit')) return;

    event.preventDefault();

    var util = FormUtils();
    var form = document.getElementById('js-masspay-form');
    var data = util.convertFormData(util.serializeForm(form));

    mp.submit(data).then(function(result) {
      if (result.success) {
        var success = document.getElementById('js-success');
        var masspay = document.getElementById('js-masspay');
        success.style.display = 'block';
        masspay.style.display = 'none';
      } else {
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

    var util = MoneyUtils();
    var amounts = document.querySelectorAll('input[name="amount"]');

    var totalElements = document.querySelectorAll('.js-total');

    for (var i = 0; i < totalElements.length; i++) {
      totalElements[i].innerHTML = util.totalAmounts(amounts);
    }
  });
})();
