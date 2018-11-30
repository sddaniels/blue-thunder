const expect  = require('chai').expect;
const Masspay = require('../src/js/Masspay');

const mp = Masspay();

describe ('Masspay', function() {
  describe('getKnownReceivers', function() {
    it('should return the list of known receivers', function() {
      var receivers = mp.getKnownReceivers();
      expect(receivers.length).to.equal(10);
    });
  });

  describe('isKnownSender', function() {
    it('should return false when name is not in known recievers list', function() {
      expect(mp.isKnownSender('chester.copperpot@test.com')).to.be.false;
    });

    it('should return true when name is in known receivers list', function() {
      expect(mp.isKnownSender('cordell@test.com')).to.be.true;
    });
  });


  describe('isEmailAddress', function() {
    it('should return false when at symbol is missing', function() {
      expect(mp.isEmailAddress('test')).to.be.false;
    });

    it('should return true when at symbol is present', function() {
      expect(mp.isEmailAddress('test@test.com')).to.be.true;
    });
  });

  describe('isValidReceiver', function() {
    it('should return false when receiver is null', function() {
      expect(mp.isValidReceiver()).to.be.false;
    });

    it('should return false when not a known receiver', function() {
      expect(mp.isValidReceiver('test')).to.be.false;
    });

    it('should return true when known receiver', function() {
      expect(mp.isValidReceiver('emerald@test.com')).to.be.true;
    });
  });

  describe('isValidAmount', function() {
      it('should return false when not a number', function() {
        expect(mp.isValidAmount('borked')).to.be.false;
      });

      it('should return false when zero', function() {
        expect(mp.isValidAmount(0)).to.be.false;
      });

      it('should return false when negative', function() {
        expect(mp.isValidAmount(-1)).to.be.false;
      });

      it('should return false when too many decimal places', function() {
        expect(mp.isValidAmount(5.343)).to.be.false;
      });

      it('should return true when a valid amount', function() {
        expect(mp.isValidAmount(5.42)).to.be.true;
      });
  });

  describe('submit', function() {
    it('should return error when items are null', function() {
      var result = mp.submit();
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when items are not an array', function() {
      var result = mp.submit({});
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when items are empty', function() {
      var result = mp.submit([]);
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when invalid receiver present', function() {
      var result = mp.submit([
        { receiver: 'julio@test.com', amount: '1.00' },
        { receiver: 'kendrick@test.com', amount: '1.00' },
        { receiver: 'Hiawatha Stone', amount: '1.00' }
      ]);
      expect(result.success).to.be.false;
      expect(result.error).to.equal('invalidReceiver');
      expect(result.item).to.equal(2);
    });

    it('should return success when valid', function() {
      var result = mp.submit([
        { receiver: 'julio@test.com', amount: '1.00' },
        { receiver: 'kendrick@test.com', amount: '1.00' },
        { receiver: 'vikram@test.com', amount: '1.00' }
      ]);
      expect(result.success).to.be.true;
      expect(result.error).to.be.undefined;
    });
  });
});
