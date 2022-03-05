import type { NextApiRequest, NextApiResponse } from "next";
import { SessionUtils, StorageUtils } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | { error: string }
    | {
        success: string;
      }
  >
) {
  SessionUtils(req, res).user.logout();
  res.redirect(302, "/");
}
