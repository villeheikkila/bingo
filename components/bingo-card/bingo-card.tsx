import classnames from "classnames";
import styles from "./bingo-card.module.css";

interface BingoCardProps {
  values: number[][];
  drawnNumbers: number[];
  missedNumbers: number[];
}

export const BingoCard = ({
  values,
  drawnNumbers,
  missedNumbers,
}: BingoCardProps) => {
  return (
    <div className={styles.bingoContainer}>
      <div className={styles.bingoCard}>
        {values.map((rows) =>
          rows.map((cell) => (
            <BingoCell
              key={cell}
              value={cell}
              isPositive={drawnNumbers.includes(cell) || cell === 0}
            />
          ))
        )}
      </div>
      <div className={styles.missedValuesContainer}>
        {missedNumbers.map((missedNumber) => (
          <div
            key={missedNumber}
            className={classnames(styles.bingoCell, styles.isMissed)}
          >
            {missedNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

interface BingoCellProps {
  value: number;
  isPositive: boolean;
}

const BingoCell = ({ value, isPositive }: BingoCellProps) => {
  return (
    <div
      className={classnames(styles.bingoCell, {
        [styles.isPositive]: isPositive,
      })}
    >
      <span>{value === 0 ? "Free" : value}</span>
    </div>
  );
};
