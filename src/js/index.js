import Masspay from './Masspay';
import formSerializer from './formSerializer';


(function () {
  var mp = Masspay();

  document.addEventListener('click', function(event) {
      if (!event.target.matches('#js-submit')) return;

      event.preventDefault();

      var form = document.getElementById('js-masspay');
      var raw = formSerializer(form);

      var data = [];
      var previous;
      for(var i = 0; i < raw.length; i++) {
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

      console.log(mp.submit(data));
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
})();
