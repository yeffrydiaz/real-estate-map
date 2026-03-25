import { MortgageCalculatorInputs, MortgageCalculatorResults } from "./types";

export function calculateMortgage(
  inputs: MortgageCalculatorInputs
): MortgageCalculatorResults {
  const {
    homePrice,
    downPayment,
    loanTerm,
    interestRate,
    propertyTax,
    homeInsurance,
    pmiRate,
  } = inputs;

  const downPaymentAmount = (homePrice * downPayment) / 100;
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  // Principal & interest (standard amortization formula)
  let monthlyPrincipalInterest = 0;
  if (monthlyRate === 0) {
    monthlyPrincipalInterest = loanAmount / numPayments;
  } else {
    monthlyPrincipalInterest =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  // Monthly property tax (annual / 12)
  const monthlyPropertyTax = (homePrice * propertyTax) / 100 / 12;

  // Monthly home insurance
  const monthlyInsurance = homeInsurance / 12;

  // PMI applies when down payment < 20%
  const monthlyPMI =
    downPayment < 20 ? (loanAmount * pmiRate) / 100 / 12 : 0;

  const totalMonthlyPayment =
    monthlyPrincipalInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    monthlyPMI;

  const totalPayment = monthlyPrincipalInterest * numPayments;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    totalMonthlyPayment,
    totalPayment,
    totalInterest,
    loanAmount,
    downPaymentAmount,
  };
}
