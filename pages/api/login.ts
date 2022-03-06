import type { NextApiRequest, NextApiResponse } from "next";
import { SessionUtils, StorageUtils } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        success: string;
      }
    | {
        error: string;
      }
  >
) {
  const body = JSON.parse(req.body);
  const username = body?.username;

  if (!username) {
    res.status(400).json({ error: "username is required" });
  }

  /* 
    This is obviously ridiculous, anyone can login as another user by just knowing the username.
    Fixing this would be trivial by adding a password and by forbidding duplicate users.
   */
  const existingUser = await StorageUtils.user(username).get();
  SessionUtils(req, res).user.set(username);

  if (existingUser) {
    // Redirect the existing user to a currently active game
    res.redirect(302, `/${existingUser.gameId}`).end();
    return;
  }

  // Immediately create the fist game for the user
  const gameId = StorageUtils.bingoCard().new();
  // User can only be part of one game at the time
  StorageUtils.user(username).set({ gameId });
  StorageUtils.gameStatus(username, gameId).new();
  // Create empty score card for the suer
  StorageUtils.scoreCard(username).new();
  res.redirect(302, `/${gameId}`).end();
}
