import { StorageUtils } from ".";
import { pickRandomInArray, shuffle } from "./array-utils";

const pickFiveRandomInRange = ([min, max]: [number, number]) =>
  Array.from({ length: 5 }, (_) => null).reduce(
    ({ availableValues, valuesToReturn }, c) => {
      const randomValue = pickRandomInArray(availableValues);
      return {
        availableValues: availableValues.filter((n) => n !== randomValue),
        valuesToReturn: [...valuesToReturn, randomValue],
      };
    },
    {
      availableValues: Array.from({ length: max - min }).map((_, i) => min + i),
      valuesToReturn: [] as number[],
    }
  ).valuesToReturn;

const includesOrFree = (arr: number[], n: number) =>
  arr.includes(n) || n === FREE_NUMBER;

const isWon = (bingoCard: number[][], drawnNumbers: number[]) => {
  const length = bingoCard[0].length;
  const arr = Array.from({ length });

  const verticalBingo = bingoCard.some((row) =>
    row.every((number) => includesOrFree(drawnNumbers, number))
  );

  const horizontalBingo = arr
    .map((_, i) => bingoCard.map((col) => col[i]))
    .some((row) => row.every((number) => includesOrFree(drawnNumbers, number)));

  const diagonalBingoR = arr
    .map((_, i) => bingoCard[i][i])
    .every((number) => includesOrFree(drawnNumbers, number));

  const diagonalBingoL = arr
    .map((_, i) => bingoCard[i][length - 1 - i])
    .every((number) => includesOrFree(drawnNumbers, number));

  return horizontalBingo || verticalBingo || diagonalBingoR || diagonalBingoL;
};

export const getGameStatus = (
  { card }: StorageUtils.Bingo,
  previouslydrawnNumbers: number[],
  currentPick: number
) => {
  const drawnNumbers = [...previouslydrawnNumbers, currentPick];

  return {
    isWon: isWon(card, drawnNumbers),
    drawnNumbers,
  };
};

const ranges: [number, number][] = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
];

const numbersInGame = Array.from({ length: 75 }, (_, i) => i + 1);

export const FREE_NUMBER = 0;

export const generateBingo = () => {
  const card = ranges.map(pickFiveRandomInRange);
  const availableNumbers = shuffle(numbersInGame);
  // Add a free bingo cell
  const randomIndex = Math.floor(Math.random() * card.length);
  card[randomIndex][randomIndex] = FREE_NUMBER;
  return {
    card,
    availableNumbers,
  };
};
