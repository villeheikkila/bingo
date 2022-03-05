import type { NextApiRequest, NextApiResponse } from "next";
import { BingoUtils, SessionUtils, StorageUtils } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | { error: string }
    | {
        success: string;
      }
  >
) {
  const username = SessionUtils(req, res).user.get();

  if (username) {
    const gameId = await StorageUtils.bingoCard().new();
    // User can only be part of one game at the time
    StorageUtils.user(username).set({ gameId });
    // Start the game by creating empty game values
    StorageUtils.gameStatus(username, gameId).new();
    res.redirect(302, `/${gameId}`).end();
  } else {
    res.status(400).json({ error: "username is required" });
  }
}
