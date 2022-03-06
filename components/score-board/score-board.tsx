import { time } from "console";
import { StorageUtils } from "../../utils";
import styles from "./score-board.module.css";

interface ScoreBoardProps {
  data: StorageUtils.Score[];
}

const Timestamp = ({ timestamp }: { timestamp: Date }) => {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const min = d.getMinutes().toString().padStart(2, "0");
  const hours = d.getHours();

  return (
    <span>
      {day}.{month}.{year} {hours}:{min}
    </span>
  );
};
export const ScoreBoard = ({ data }: ScoreBoardProps) => {
  return (
    <div className={styles.scoreBoard}>
      <h1>Scoreboard</h1>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody className={styles.scoreBoardTable}>
          {data.map(({ timestamp, score }) => (
            <tr key={timestamp.toString()}>
              <td>
                <Timestamp timestamp={timestamp} />
              </td>
              <td className={styles.score}>{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
