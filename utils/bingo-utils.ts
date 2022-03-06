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

const pickAvailableNumber = (bingoCard: number[][], drawnNumbers: number[]) => {
  const numbersInBingoCard = bingoCard.flat();
  const availableNumbers = numbersInBingoCard.filter(
    (n) => !drawnNumbers.includes(n)
  );
  return pickRandomInArray(availableNumbers);
};

const isWon = (bingoCard: number[][], drawnNumbers: number[]) => {
  const verticalBingo = bingoCard.some((row) =>
    row.every((number) => drawnNumbers.includes(number))
  );

  const length = bingoCard[0].length;

  const horizontalBingo = Array.from({ length })
    .map((_, i) => bingoCard.map((col) => col[i]))
    .some((row) => row.every((number) => drawnNumbers.includes(number)));

  const diagonalBingoR = Array.from({ length })
    .map((_, i) => bingoCard[i][i])
    .every((number) => drawnNumbers.includes(number));

  const diagonalBingoL = Array.from({ length })
    .map((_, i) => bingoCard[i][length - 1 - i])
    .every((number) => drawnNumbers.includes(number));

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

export const generateBingo = () => {
  const card = ranges.map(pickFiveRandomInRange);
  const availableNumbers = shuffle(numbersInGame);
  //   const randomIndex = Math.floor(Math.random() * bingoRows.length);
  //   bingoRows[randomIndex][randomIndex] = 0;
  return {
    card,
    availableNumbers,
  };
};
