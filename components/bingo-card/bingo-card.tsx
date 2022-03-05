import classnames from "classnames";
import styles from "./bingo-card.module.css";

interface BingoCardProps {
  values: number[][];
  pickedNumbers: number[];
  missedNumbers: number[];
}

export const BingoCard = ({
  values,
  pickedNumbers,
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
              isPicked={pickedNumbers.includes(cell)}
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
  isPicked: boolean;
}

const BingoCell = ({ value, isPicked }: BingoCellProps) => {
  return (
    <div
      className={classnames(styles.bingoCell, { [styles.isPicked]: isPicked })}
    >
      <span>{value}</span>
    </div>
  );
};
