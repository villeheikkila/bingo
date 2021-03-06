import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { BingoCard, ScoreBoard, Header } from "../components";

import styles from "../styles/game.module.css";
import { SessionUtils, StorageUtils } from "../utils";

const Bingo: NextPage<ServerSideProps> = ({
  bingoCard,
  username,
  gameStatus,
  scoreCard,
}) => {
  const router = useRouter();
  const [currentGameStatus, setCurrentGameStatus] = useState(gameStatus);
  const [inProgress, setInProgress] = useState(false);

  const drawNumber = async () => {
    setInProgress(true);
    const response = await fetch("/api/draw");
    const updatedGameStatus = await response.json();
    setCurrentGameStatus(updatedGameStatus);
    setInProgress(false);
  };

  const startNewGame = () => {
    fetch("/api/start").then((res) => {
      if (res.redirected) {
        router.push(res.url);
      }
    });
  };

  const missedNumbers = () => {
    const allValuesInCard = bingoCard.card.flat();
    return currentGameStatus.drawnNumbers.filter(
      (n) => !allValuesInCard.includes(n)
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Bingo</title>
        <meta name="description" content="Bingo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header username={username} />

      <main className={styles.main}>
        <div className={styles.controls}>
          {currentGameStatus.isWon ? (
            <>
              <b>BINGO!</b>
              <span>
                You won after {currentGameStatus.drawnNumbers.length} draws
              </span>
              <button className={styles.button} onClick={startNewGame}>
                Start new game!
              </button>
            </>
          ) : (
            <button
              onClick={drawNumber}
              className={styles.button}
              disabled={inProgress}
            >
              Draw!
            </button>
          )}
        </div>
        <div className={styles.bingoContainer}>
          <BingoCard
            values={bingoCard.card}
            drawnNumbers={currentGameStatus.drawnNumbers}
            missedNumbers={missedNumbers()}
          />
        </div>

        {scoreCard.scores.length > 0 ? (
          <ScoreBoard data={scoreCard.scores} />
        ) : null}
      </main>
    </div>
  );
};

type ServerSideProps = {
  username: string;
  key: string;
  bingoCard: StorageUtils.Bingo;
  gameStatus: StorageUtils.GameStatus;
  scoreCard: StorageUtils.ScoreCard;
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  try {
    // If id doesn't exist, wouldn't be routed here
    const gameId = String(params?.id);
    const username = SessionUtils(req, res).user.get();

    if (!username) throw Error("username does not exist");

    const bingoCard = await StorageUtils.bingoCard().get(gameId);
    if (!bingoCard) throw Error("game not found");

    const gameStatus = await StorageUtils.gameStatus(username, gameId).get();
    if (!gameStatus) throw Error("game status is missing");

    const scoreCard = await StorageUtils.scoreCard(username).get();
    if (!scoreCard) throw Error("score card is missing");

    const props: ServerSideProps = {
      bingoCard,
      username,
      gameStatus,
      scoreCard,
      key: gameId,
    };

    return {
      props,
    };
  } catch (e) {
    console.error(e);
    /* 
      If any of the data is missing, redirect the user to the new account creation page
      This is obviously not ideal but should be ok for now.
    */
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};

export default Bingo;
