import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";

const SessionUtils = (req: IncomingMessage, res: ServerResponse) => {
  const cookies = new Cookies(req, res);
  return {
    user: {
      logout: () => {
        return cookies.set("username", "", { expires: new Date() });
      },
      set: (username: string) => {
        return cookies.set("username", username);
      },
      get: () => {
        return cookies.get("username");
      },
    },
  };
};

export default SessionUtils;
