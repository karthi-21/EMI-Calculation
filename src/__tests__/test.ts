import { EMICalculation } from '../index';
test('My EMI Calculation', () => {
    const emi = new EMICalculation();
  expect(Object(emi.calculate(100000, 10, 12, 'fir')).totalPayable).toBe(110000.00);
});