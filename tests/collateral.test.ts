import { describe, it, expect } from 'vitest';

// Mock Clarity values and functions
const mockClarityValue = (type) => (value) => ({ type, value });

const uint = mockClarityValue('uint');
const principal = mockClarityValue('principal');

// Mock data variables and maps
const userCollateral = new Map();

// Mock contract functions

const depositCollateral = (txSender, amount) => {
  if (amount < 1) return { err: 100 }; // Insufficient amount
  userCollateral.set(txSender, (userCollateral.get(txSender) || 0) + amount);
  return { ok: true };
};

const withdrawCollateral = (txSender, amount) => {
  const currentCollateral = userCollateral.get(txSender) || 0;
  if (currentCollateral < amount) return { err: 101 }; // Withdrawal exceeds collateral
  userCollateral.set(txSender, currentCollateral - amount);
  return { ok: true };
};

const getCollateral = (user) => {
  return { ok: userCollateral.get(user) || 0 };
};

// Tests
describe('Collateral Contract Tests', () => {
  it('should deposit collateral successfully', () => {
    const result = depositCollateral('user-1', 100);
    expect(result).toEqual({ ok: true });
    expect(userCollateral.get('user-1')).toEqual(100);
  });
  
  it('should withdraw collateral successfully', () => {
    const result = withdrawCollateral('user-1', 50);
    expect(result).toEqual({ ok: true });
    expect(userCollateral.get('user-1')).toEqual(50);
  });
  
  it('should not allow withdrawal exceeding collateral', () => {
    const result = withdrawCollateral('user-1', 100);
    expect(result).toEqual({ err: 101 }); // Error: Withdrawal exceeds collateral
  });
  
  it('should not allow deposit of zero or negative amount', () => {
    const result = depositCollateral('user-1', 0);
    expect(result).toEqual({ err: 100 }); // Error: Insufficient amount
  });
  
  it('should return correct collateral balance', () => {
    const result = getCollateral('user-1');
    expect(result).toEqual({ ok: 50 });
  });
});
