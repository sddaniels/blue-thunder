const expect = require('chai').expect;
const MoneyUtils = require('../src/js/MoneyUtils');

const util = MoneyUtils();

describe('MoneyUtils', () => {
  describe('totalAmounts', () => {
    it('should return zero when empty', () => {
      const result = util.totalAmounts([]);
      expect(result).to.eq('$0.00');
    });

    it('should return the total from the given elements', () => {
      const inputs = [
        { value: '42' },
        { value: '8' },
        { value: '50' }
      ];

      const result = util.totalAmounts(inputs);

      expect(result).to.eq('$100.00');
    });

    it('should ignore values that are not numbers', () => {
      const inputs = [
        { value: '50' },
        { value: 'hi' }
      ];

      const result = util.totalAmounts(inputs);

      expect(result).to.eq('$50.00');
    });

    it('should ignore numbers that bad numbers', () => {
      const inputs = [
        { value: '50' },
        { value: '-4' },
        { value: '56.4333'}
      ];

      const result = util.totalAmounts(inputs);

      expect(result).to.eq('$50.00');
    });
  });
});
