import { google } from "googleapis";
import fs from "fs";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback",
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/gmail.send"],
  prompt: "consent",
});

console.log("Authorize this app by visiting this URL:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("Refresh Token:", tokens.refresh_token);
    console.log("Access Token:", tokens.access_token);

    const envContent = `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\nGMAIL_ACCESS_TOKEN=${tokens.access_token}`;
    fs.writeFileSync(".env.token", envContent);

    console.log("Tokens have been saved to .env.token file");
  } catch (error) {
    console.error("Error getting tokens:", error);
  }
});
