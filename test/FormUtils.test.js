const expect  = require('chai').expect;
const FormUtils = require('../src/js/FormUtils');

const util = FormUtils();
const sampleForm = {
  elements: [
    {
      name: 'receiver',
      value: 'juliana@test.com'
    },
    {
      name: 'amount',
      value: '42'
    },
    {
      name: 'receiver',
      value: 'cordell@test.com'
    },
    {
      name: 'amount',
      value: '404'
    }
  ]};
const sampleSerializedData = [
  { receiver: 'juliana@test.com' },
  { amount: '42' },
  { receiver: 'cordell@test.com' },
  { amount: '404' }
];

describe('FormUtils', () => {
  describe('serializeForm', () => {
    it('should serialize an empty form', () => {
      const form = { elements: [] };

      const result = util.serializeForm(form);

      expect(result).to.be.deep.eq([]);
    });

    it('should serialize a form with receiver and amount fields', () => {
      const result = util.serializeForm(sampleForm);

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore fields with no name', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          { value: '66' }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore disabled fields', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            name: 'test',
            value: 'a',
            disabled: true
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore reset fields', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'reset',
            name: 'test'
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore submit fields', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'submit',
            name: 'test'
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore button fields', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'button',
            name: 'test'
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore checkbox fields that are not selected', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'checkbox',
            name: 'test'
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should ignore radiobutton fields that are not selected', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'radio',
            name: 'test'
          }
        ]
      });

      expect(result).to.be.deep.eq(sampleSerializedData);
    });

    it('should record checkbox fields that are chedked', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'checkbox',
            name: 'test',
            value: 'bicycle',
            checked: true
          }
        ]
      });

      expect(result).to.be.deep.eq([
        ...sampleSerializedData,
        { test: 'bicycle' }
      ]);
    });

    it('should record radiobutton fields that are chedked', () => {
      const result = util.serializeForm({
        elements: [
          ...sampleForm.elements,
          {
            type: 'radio',
            name: 'test',
            value: 'bicycle',
            checked: true
          }
        ]
      });

      expect(result).to.be.deep.eq([
        ...sampleSerializedData,
        { test: 'bicycle' }
      ]);
    });
  });

  describe('convertFormData', () => {
    it('should convert raw data from a form into JSON for the Masspay library', function() {
      const result = util.convertFormData(sampleSerializedData);

      expect(result).to.deep.eq([
        {
          receiver: 'juliana@test.com',
          amount: '42'
        },
        {
          receiver: 'cordell@test.com',
          amount: '404'
        },
      ]);
    });

    it('should skip empty rows', () => {
      const result = util.convertFormData([
        ...sampleSerializedData,
        { receiver: '' },
        { amount: '' }
      ]);

      expect(result).to.deep.eq([
        {
          receiver: 'juliana@test.com',
          amount: '42'
        },
        {
          receiver: 'cordell@test.com',
          amount: '404'
        },
      ]);
    });

    it('should not skip only empty receiver', () => {
      const source = [
        { receiver: 'juliana@test.com' },
        { amount: '42' },
        { receiver: '' },
        { amount: '5' },
        { receiver: 'cordell@test.com' },
        { amount: '404' },
      ];

      const result = util.convertFormData([
        ...sampleSerializedData,
        { receiver: '' },
        { amount: '5' }
      ]);

      expect(result).to.deep.eq([
        {
          receiver: 'juliana@test.com',
          amount: '42'
        },
        {
          receiver: 'cordell@test.com',
          amount: '404'
        },
        {
          receiver: '',
          amount: '5'
        }
      ]);
    });

    it('should not skip only empty amount', () => {
      const result = util.convertFormData([
        ...sampleSerializedData,
        { receiver: 'bai@test.com' },
        { amount: '' }
      ]);

      expect(result).to.deep.eq([
        {
          receiver: 'juliana@test.com',
          amount: '42'
        },
        {
          receiver: 'cordell@test.com',
          amount: '404'
        },
        {
          receiver: 'bai@test.com',
          amount: ''
        }
      ]);
    });
  });
});
