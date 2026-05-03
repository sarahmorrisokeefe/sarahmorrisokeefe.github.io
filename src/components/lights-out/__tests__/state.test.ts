import { describe, it, expect } from 'vitest';
import { initialContext, reduce, type Context } from '../state';

describe('lights-out state machine', () => {
  const baseCtx: Context = initialContext({ bestMs: null });

  it('starts in idle', () => {
    expect(baseCtx.state).toBe('idle');
  });

  it('idle + INPUT transitions to arming', () => {
    const next = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    expect(next.state).toBe('arming');
  });

  it('arming + LIGHTS_ARMED transitions to holding', () => {
    const armed = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    const holding = reduce(armed, { type: 'LIGHTS_ARMED' });
    expect(holding.state).toBe('holding');
  });

  it('arming + INPUT transitions to jumpStart', () => {
    const armed = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    const jumped = reduce(armed, { type: 'INPUT', timestamp: 100 });
    expect(jumped.state).toBe('jumpStart');
  });

  it('holding + INPUT transitions to jumpStart', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 200 });
    expect(ctx.state).toBe('jumpStart');
  });

  it('holding + LIGHTS_OUT transitions to live and stores liveStartTime', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 1234 });
    expect(ctx.state).toBe('live');
    expect(ctx.liveStartTime).toBe(1234);
  });

  it('live + INPUT transitions to result and computes reactionMs', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 1000 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 1287 });
    expect(ctx.state).toBe('result');
    expect(ctx.reactionMs).toBe(287);
  });

  it('result with new best updates bestMs and flags isNewBest', () => {
    let ctx = reduce(initialContext({ bestMs: 500 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.reactionMs).toBe(287);
    expect(ctx.bestMs).toBe(287);
    expect(ctx.isNewBest).toBe(true);
  });

  it('result with non-best keeps existing bestMs and clears isNewBest', () => {
    let ctx = reduce(initialContext({ bestMs: 200 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.bestMs).toBe(200);
    expect(ctx.isNewBest).toBe(false);
  });

  it('result with no prior best treats first time as a new best', () => {
    let ctx = reduce(initialContext({ bestMs: null }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    expect(ctx.bestMs).toBe(287);
    expect(ctx.isNewBest).toBe(true);
  });

  it('result + RACE_AGAIN transitions to arming, clears transient fields, and preserves bestMs', () => {
    let ctx = reduce(initialContext({ bestMs: 200 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'LIGHTS_ARMED' });
    ctx = reduce(ctx, { type: 'LIGHTS_OUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 287 });
    ctx = reduce(ctx, { type: 'RACE_AGAIN' });
    expect(ctx.state).toBe('arming');
    expect(ctx.reactionMs).toBe(null);
    expect(ctx.liveStartTime).toBe(null);
    expect(ctx.isNewBest).toBe(false);
    expect(ctx.bestMs).toBe(200);
  });

  it('jumpStart + JUMP_START_RECOVERED returns to idle', () => {
    let ctx = reduce(baseCtx, { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'INPUT', timestamp: 100 });
    expect(ctx.state).toBe('jumpStart');
    ctx = reduce(ctx, { type: 'JUMP_START_RECOVERED' });
    expect(ctx.state).toBe('idle');
  });

  it('OPEN resets the context to idle while preserving bestMs', () => {
    let ctx = reduce(initialContext({ bestMs: 250 }), { type: 'INPUT', timestamp: 0 });
    ctx = reduce(ctx, { type: 'OPEN' });
    expect(ctx.state).toBe('idle');
    expect(ctx.bestMs).toBe(250);
    expect(ctx.reactionMs).toBe(null);
    expect(ctx.liveStartTime).toBe(null);
    expect(ctx.isNewBest).toBe(false);
  });

  it('ignores irrelevant events without changing state', () => {
    const next = reduce(baseCtx, { type: 'LIGHTS_OUT', timestamp: 1000 });
    expect(next).toBe(baseCtx);
  });
});
