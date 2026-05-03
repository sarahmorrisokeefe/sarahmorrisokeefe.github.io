import { describe, it, expect, beforeEach } from 'vitest';
import {
  readBestMs,
  writeBestMs,
  readSoundEnabled,
  writeSoundEnabled,
} from '../storage';

describe('lights-out storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('bestMs', () => {
    it('returns null when key is missing', () => {
      expect(readBestMs()).toBe(null);
    });

    it('returns null for non-numeric values', () => {
      localStorage.setItem('lightsOut.bestMs', 'not-a-number');
      expect(readBestMs()).toBe(null);
    });

    it('returns null for negative values', () => {
      localStorage.setItem('lightsOut.bestMs', '-5');
      expect(readBestMs()).toBe(null);
    });

    it('returns null for NaN', () => {
      localStorage.setItem('lightsOut.bestMs', 'NaN');
      expect(readBestMs()).toBe(null);
    });

    it('returns the stored number when valid', () => {
      localStorage.setItem('lightsOut.bestMs', '287');
      expect(readBestMs()).toBe(287);
    });

    it('round-trips a written value', () => {
      writeBestMs(241);
      expect(readBestMs()).toBe(241);
    });

    it('writeBestMs ignores negative input', () => {
      writeBestMs(-1);
      expect(readBestMs()).toBe(null);
    });

    it('writeBestMs ignores non-finite input', () => {
      writeBestMs(Infinity);
      expect(readBestMs()).toBe(null);
    });
  });

  describe('soundEnabled', () => {
    it('defaults to false when missing', () => {
      expect(readSoundEnabled()).toBe(false);
    });

    it('reads "true" as true', () => {
      localStorage.setItem('lightsOut.soundEnabled', 'true');
      expect(readSoundEnabled()).toBe(true);
    });

    it('reads anything else as false', () => {
      localStorage.setItem('lightsOut.soundEnabled', 'yes');
      expect(readSoundEnabled()).toBe(false);
    });

    it('round-trips a written boolean', () => {
      writeSoundEnabled(true);
      expect(readSoundEnabled()).toBe(true);
      writeSoundEnabled(false);
      expect(readSoundEnabled()).toBe(false);
    });
  });
});
