const Masspay = require('./Masspay');

const MoneyUtils = function() {
  const mp = Masspay();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });

  function totalAmounts(inputNodes) {
    var total = 0;
    for (var i = 0; i < inputNodes.length; i++) {
      if (mp.isValidAmount(inputNodes[i].value)) {
        total += Number(inputNodes[i].value);
      }
    }
    return formatter.format(total);
  }

  return {
    totalAmounts: totalAmounts
  };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MoneyUtils;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return MoneyUtils;
    });
  } else {
    window.MoneyUtils = MoneyUtils;
  }
}
