import type { NextApiRequest, NextApiResponse } from "next";
import { BingoUtils, SessionUtils, StorageUtils } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ error: string } | StorageUtils.GameStatus>
) {
  const username = SessionUtils(req, res).user.get();

  if (username) {
    const user = await StorageUtils.user(username).get();

    if (user) {
      const bingo = await StorageUtils.bingoCard().get(user.gameId);

      if (!bingo) {
        throw Error(`bingo card by id ${user.gameId} does not exist`);
      }

      const previousGameStatus = await StorageUtils.gameStatus(
        username,
        user.gameId
      ).get();

      if (!previousGameStatus) {
        throw Error(
          `user ${username} is missing game status for game id: ${user.gameId}`
        );
      }

      if (previousGameStatus.isWin) {
        res.status(200).json(previousGameStatus);
        return; // The game ends in a bingo, ignore picks
      }

      const currentPick = bingo.availableNumbers.pop();
      if (!currentPick) throw Error("no more available numbers left");

      await StorageUtils.bingoCard().removeAvailableNumber(
        user.gameId,
        currentPick
      );

      const gameStatus = BingoUtils.getGameStatus(
        bingo,
        previousGameStatus.pickedNumbers,
        currentPick
      );

      await StorageUtils.gameStatus(username, user.gameId).set(gameStatus);

      if (gameStatus.isWin) {
        // Stamp the number of tries it took to get the bingo
        const timestamp = new Date();
        const score = gameStatus.pickedNumbers.length;
        await StorageUtils.scoreCard(username).add({ timestamp, score });
      }

      res.status(200).json(gameStatus);
      return;
    }
    res.status(400).json({ error: "game not found" });
    return;
  } else {
    res.status(401);
  }
}
