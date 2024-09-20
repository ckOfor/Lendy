import { describe, it, expect } from 'vitest';

// Mock Clarity values and functions
const mockClarityValue = (type) => (value) => ({ type, value });

const uint = mockClarityValue('uint');
const principal = mockClarityValue('principal');

// Mock data variables and maps
const userLoans = new Map();
const userRepayments = new Map();

// Mock contract functions

const issueLoan = (txSender, amount) => {
  userLoans.set(txSender, amount);
  return { ok: true };
};

const repayLoan = (txSender, amount) => {
  const currentLoan = userLoans.get(txSender) || 0;
  if (amount > currentLoan) return { err: 101 }; // Cannot repay more than loan amount
  userLoans.set(txSender, currentLoan - amount);
  userRepayments.set(txSender, (userRepayments.get(txSender) || 0) + amount);
  return { ok: true };
};

const getLoanBalance = (user) => {
  return { ok: userLoans.get(user) || 0 };
};

const getRepayments = (user) => {
  return { ok: userRepayments.get(user) || 0 };
};

// Tests
describe('Lending Contract Tests', () => {
  it('should issue a loan successfully', () => {
    const result = issueLoan('user-1', 100);
    expect(result).toEqual({ ok: true });
    expect(userLoans.get('user-1')).toEqual(100);
  });
  
  it('should repay a loan successfully', () => {
    const result = repayLoan('user-1', 50);
    expect(result).toEqual({ ok: true });
    expect(userLoans.get('user-1')).toEqual(50);
    expect(userRepayments.get('user-1')).toEqual(50);
  });
  
  it('should not allow repayment exceeding loan amount', () => {
    const result = repayLoan('user-1', 100);
    expect(result).toEqual({ err: 101 }); // Error: Cannot repay more than loan amount
  });
  
  it('should return correct loan balance', () => {
    const result = getLoanBalance('user-1');
    expect(result).toEqual({ ok: 50 });
  });
  
  it('should return correct total repayments made', () => {
    const result = getRepayments('user-1');
    expect(result).toEqual({ ok: 50 });
  });
});
