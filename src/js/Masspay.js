const Masspay = function() {

  const KNOWN_RECIEVERS = [
    'juliana@test.com',
    'ike@test.com',
    'cordell@test.com',
    'kendrick@test.com',
    'hiawatha@test.com',
    'skyler@test.com',
    'julio@test.com',
    'bai@test.com',
    'vikram@test.com',
    'emerald@test.com'
  ];

  function getKnownReceivers() {
    return KNOWN_RECIEVERS.slice();
  }

  function isKnownSender(name) {
    return KNOWN_RECIEVERS.includes(name);
  }

  function isEmailAddress(email) {
    return email.includes('@');
  }

  function isValidReceiver(receiver) {
    return !!receiver && isKnownSender(receiver);
  }

  function itemsAreEmpty(items) {
    return !items || !Array.isArray(items) || items.length < 1;
  }

  function submit(items) {
    if (itemsAreEmpty(items)) {
      return {
        "success": false,
        "error": "empty"
      };
    }

    for (var i = 0; i < items.length; i++) {
      if (!isValidReceiver(items[i].receiver)) {
        return {
          "success": false,
          "error": "invalidReceiver",
          "item": i
        };
      }
    }

    return {
      "success": true
    };
  }

  return {
    getKnownReceivers: getKnownReceivers,
    isKnownSender: isKnownSender,
    isEmailAddress: isEmailAddress,
    isValidReceiver: isValidReceiver,
    submit: submit
  };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Masspay;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Masspay;
    });
  } else {
    window.Masspay = Masspay;
  }
}
