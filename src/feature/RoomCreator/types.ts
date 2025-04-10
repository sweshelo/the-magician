export interface RoomCreatePayload {
  name: string;
  handicap: {
    draw: boolean;
    attack: boolean;
    cp: boolean;
  };
  misc: {
    strictOverride: boolean;
    suicideJoker: boolean;
  };
  max: {
    round: number;
    field: number;
  };
  draw: {
    top: number;
    override: number;
    mulligan: number;
  };
  strictOverride: boolean;
  cp: {
    init: number;
    increase: number;
    max: number;
    ceil: number;
    carryover: boolean;
  };
  player: {
    life: number;
    hand: number;
    trigger: number;
  };
  debug: {
    enable: boolean;
    reveal: {
      opponent: {
        deck: boolean;
        hand: boolean;
        trigger: boolean;
        trash: boolean;
      };
      self: {
        deck: boolean;
      };
    };
  };
}
