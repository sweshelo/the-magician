// Default values for room creator settings
export const DEFAULT_ROOM_SETTINGS = {
  name: '',
  rule: {
    system: {
      round: 10,
      turnTime: 60,
      draw: {
        top: 2,
        override: 1,
        mulligan: 4,
      },
      handicap: {
        draw: true,
        cp: true,
        attack: true,
      },
      cp: {
        init: 2,
        increase: 1,
        max: 7,
        ceil: 12,
        carryover: false,
      },
    },
    player: {
      max: {
        life: 8,
        hand: 7,
        trigger: 4,
        field: 5,
      },
    },
    misc: {
      strictOverride: false,
      autoEndOnTimeout: true,
    },
    joker: {
      suicide: false,
      single: false,
      inHand: false,
      gauge: 0,
      lifeDamage: 15,
      maxTurnEnd: 15,
      minTurnEnd: 2.5,
    },
    debug: {
      enable: false,
      reveal: {
        opponent: {
          deck: true,
          hand: true,
          trigger: true,
          trash: true,
        },
        self: {
          deck: true,
        },
      },
    },
  },
};
