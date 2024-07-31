import "dotenv/config";
import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: port(),
  JWT_SECRET: str(),
  NODE_ENV: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_CALLBACK: str(),
  FACEBOOK_APP_ID: str(),
  FACEBOOK_APP_SECRET: str(),
  FACEBOOK_CALLBACK: str(),
  TWITTER_CLIENT_ID: str(),
  TWITTER_CLIENT_SECRET: str(),
  TWITTER_CALLBACK: str(),
});
