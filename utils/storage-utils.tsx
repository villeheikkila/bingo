import Redis from "ioredis";
import JSONCache from "redis-json";
import { v4 as uuidv4 } from "uuid";
import { generateBingo } from "./bingo-utils";
import "dotenv/config";

const redisConfig = process.env.REDIS_URL;

export const redis = new Redis(redisConfig);

export const jsonStorage = new JSONCache(redis);

export interface User {
  gameId: string;
}

export const userStorage = new JSONCache<User>(redis, { prefix: "user:" });

export const user = (username: string) => {
  return {
    set: (u: User) => userStorage.set(username, u),
    get: () => userStorage.get(username),
  };
};

export interface GameStatus {
  drawnNumbers: number[];
  isWon: boolean;
}

const userGameKey = (username: string, gameId: string) =>
  `${username}-${gameId}`;

const userGameStorage = new JSONCache<GameStatus>(redis, {
  prefix: "game:",
});

export const gameStatus = (username: string, gameId: string) => {
  return {
    set: (game: GameStatus) =>
      userGameStorage.set(userGameKey(username, gameId), game),
    get: () => userGameStorage.get(userGameKey(username, gameId)),
    new: () =>
      userGameStorage.set(userGameKey(username, gameId), {
        drawnNumbers: [],
        isWon: false,
      }),
  };
};

export interface Bingo {
  card: number[][];
  availableNumbers: number[];
}

const bingoCardStorage = new JSONCache<Bingo>(redis, {
  prefix: "bingo:",
});

export const bingoCard = () => {
  return {
    removeAvailableNumber: async (gameId: string, drawnNumber: number) => {
      const oldValue = await bingoCardStorage.get(gameId);
      if (!oldValue) throw Error(`game with id ${gameId} doesn't exist`);

      const availableNumbers = oldValue?.availableNumbers.filter(
        (n) => n !== drawnNumber
      );

      await bingoCardStorage.set(gameId, { ...oldValue, availableNumbers });
    },
    get: (gameId: string) => bingoCardStorage.get(gameId),
    new: () => {
      const uniqueId = uuidv4();
      bingoCardStorage.set(uniqueId, generateBingo());
      return uniqueId;
    },
  };
};

export type Score = { timestamp: Date; score: number };

export interface ScoreCard {
  scores: Score[];
}

const scoreCardStorage = new JSONCache<ScoreCard>(redis, {
  prefix: "score:",
});

export const scoreCard = (username: string) => {
  return {
    add: async (score: Score) => {
      const previousValues = await scoreCardStorage.get(username);
      scoreCardStorage.set(username, {
        scores: [...(previousValues?.scores ?? []), score],
      });
    },
    get: () => scoreCardStorage.get(username),
    new: () => scoreCardStorage.set(username, { scores: [] }),
  };
};
