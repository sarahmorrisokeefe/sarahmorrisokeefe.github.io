export type State =
  | 'idle'
  | 'arming'
  | 'holding'
  | 'live'
  | 'result'
  | 'jumpStart';

export type GameEvent =
  | { type: 'OPEN' }
  | { type: 'INPUT'; timestamp: number }
  | { type: 'LIGHTS_ARMED' }
  | { type: 'LIGHTS_OUT'; timestamp: number }
  | { type: 'JUMP_START_RECOVERED' }
  | { type: 'RACE_AGAIN' };

export interface Context {
  state: State;
  liveStartTime: number | null;
  reactionMs: number | null;
  bestMs: number | null;
  isNewBest: boolean;
}

export function initialContext(opts: { bestMs: number | null }): Context {
  return {
    state: 'idle',
    liveStartTime: null,
    reactionMs: null,
    bestMs: opts.bestMs,
    isNewBest: false,
  };
}

export function reduce(ctx: Context, event: GameEvent): Context {
  switch (event.type) {
    case 'OPEN':
      return {
        ...ctx,
        state: 'idle',
        liveStartTime: null,
        reactionMs: null,
        isNewBest: false,
      };

    case 'INPUT':
      if (ctx.state === 'idle') {
        return { ...ctx, state: 'arming' };
      }
      if (ctx.state === 'arming' || ctx.state === 'holding') {
        return { ...ctx, state: 'jumpStart' };
      }
      if (ctx.state === 'live' && ctx.liveStartTime !== null) {
        const reactionMs = event.timestamp - ctx.liveStartTime;
        const isNewBest = ctx.bestMs === null || reactionMs < ctx.bestMs;
        return {
          ...ctx,
          state: 'result',
          reactionMs,
          isNewBest,
          bestMs: isNewBest ? reactionMs : ctx.bestMs,
        };
      }
      return ctx;

    case 'LIGHTS_ARMED':
      if (ctx.state === 'arming') {
        return { ...ctx, state: 'holding' };
      }
      return ctx;

    case 'LIGHTS_OUT':
      if (ctx.state === 'holding') {
        return { ...ctx, state: 'live', liveStartTime: event.timestamp };
      }
      return ctx;

    case 'JUMP_START_RECOVERED':
      if (ctx.state === 'jumpStart') {
        return { ...ctx, state: 'idle' };
      }
      return ctx;

    case 'RACE_AGAIN':
      if (ctx.state === 'result' || ctx.state === 'idle') {
        return { ...ctx, state: 'arming', reactionMs: null, liveStartTime: null, isNewBest: false };
      }
      return ctx;
  }
}
