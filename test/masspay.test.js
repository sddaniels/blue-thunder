const expect  = require('chai').expect;
const Masspay = require('../src/js/Masspay');

const mp = Masspay();

describe ('Masspay', function() {
  describe('getKnownReceivers', function() {
    it('should return the list of known receivers', async function() {
      var receivers = await mp.getKnownReceivers();
      expect(receivers.length).to.equal(10);
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
    it('should return false when receiver is null', async function() {
      expect(await mp.isValidReceiver()).to.be.false;
    });

    it('should return false when not a known receiver', async function() {
      expect(await mp.isValidReceiver('test')).to.be.false;
    });

    it('should return true when known receiver', async function() {
      expect(await mp.isValidReceiver('emerald@test.com')).to.be.true;
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
    it('should return error when items are null', async function() {
      var result = await mp.submit();
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when items are not an array', async function() {
      var result = await mp.submit({});
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when items are empty', async function() {
      var result = await mp.submit([]);
      expect(result.success).to.be.false;
      expect(result.error).to.equal('empty');
    });

    it('should return error when invalid receiver present', async function() {
      var result = await mp.submit([
        { receiver: 'julio@test.com', amount: '1.00' },
        { receiver: 'kendrick@test.com', amount: '1.00' },
        { receiver: 'Hiawatha Stone', amount: '1.00' }
      ]);
      expect(result.success).to.be.false;
      expect(result.error).to.equal('invalidReceiver');
      expect(result.item).to.equal(2);
    });

    it('should return success when valid', async function() {
      var result = await mp.submit([
        { receiver: 'julio@test.com', amount: '1.00' },
        { receiver: 'kendrick@test.com', amount: '1.00' },
        { receiver: 'vikram@test.com', amount: '1.00' }
      ]);
      expect(result.success).to.be.true;
      expect(result.error).to.be.undefined;
    });
  });
});
