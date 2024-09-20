import { describe, it, expect, beforeEach } from 'vitest';

// Mock data maps
const userCollateral = new Map();
const userLoans = new Map();

// Mock contract functions

const depositCollateral = (txSender, amount) => {
  if (amount < 1) return { err: 100 }; // Insufficient amount
  userCollateral.set(txSender, (userCollateral.get(txSender) || 0) + amount);
  return { ok: true };
};

const issueLoan = (txSender, amount) => {
  const collateral = userCollateral.get(txSender) || 0;
  if (collateral < amount) return { err: 100 }; // Insufficient collateral
  userLoans.set(txSender, (userLoans.get(txSender) || 0) + amount);
  userCollateral.set(txSender, collateral - amount); // Reduce collateral
  return { ok: true };
};

// Resetting state before each test
beforeEach(() => {
  userCollateral.clear();
  userLoans.clear();
});

// Tests
describe('Simple Loan Contract Tests', () => {
  it('should deposit collateral successfully', () => {
    const result = depositCollateral('user-1', 100);
    expect(result).toEqual({ ok: true });
    expect(userCollateral.get('user-1')).toEqual(100);
  });
  
  it('should issue a loan successfully if sufficient collateral exists', () => {
    depositCollateral('user-1', 100); // Ensure collateral is present
    const result = issueLoan('user-1', 50);
    expect(result).toEqual({ ok: true });
    expect(userLoans.get('user-1')).toEqual(50); // Loan should be recorded
    expect(userCollateral.get('user-1')).toEqual(50); // Collateral should be reduced
  });
  
  it('should not allow loan issuance without sufficient collateral', () => {
    const result = issueLoan('user-1', 100);
    expect(result).toEqual({ err: 100 }); // Error: Insufficient collateral
  });
});
