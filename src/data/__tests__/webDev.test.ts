import { describe, it, expect } from 'vitest';
import { packages, packageMailtoHref } from '../webDev';

describe('packageMailtoHref', () => {
  it('builds a mailto link with the URL-encoded package subject', () => {
    expect(packageMailtoHref({ mailtoSubject: 'The Custom Build' })).toBe(
      'mailto:hello@okeefesarah.com?subject=The%20Custom%20Build',
    );
  });
});

describe('packages', () => {
  it('gives every package a distinct, non-empty mailto subject', () => {
    const subjects = packages.map((p) => p.mailtoSubject);
    expect(subjects).toHaveLength(3);
    expect(new Set(subjects).size).toBe(3);
    expect(subjects.every((s) => s.length > 0)).toBe(true);
  });
});
