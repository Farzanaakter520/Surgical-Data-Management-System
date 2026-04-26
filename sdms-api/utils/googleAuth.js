
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const readline = require("readline");

const CREDENTIALS_PATH = path.resolve(__dirname, "..", "credentials.json");
const CREDENTIALS = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const oauthConfig = CREDENTIALS.installed || CREDENTIALS.web;

if (!oauthConfig) {
  throw new Error(
    "Invalid credentials.json format. Expected either 'installed' or 'web' root key."
  );
}

const { client_secret, client_id, redirect_uris } = oauthConfig;

if (!client_id || !client_secret) {
  throw new Error(
    "Invalid credentials.json: missing client_id or client_secret in OAuth config."
  );
}

const REDIRECT_URI =
  (Array.isArray(redirect_uris) && redirect_uris[0]) ||
  "urn:ietf:wg:oauth:2.0:oob";

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";

async function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("\n👉 Go to this URL and authorize this app:\n", authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    rl.question("\nEnter the code from that page here: ", (input) => {
      rl.close();
      resolve(input);
    });
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("\n✅ Token stored successfully in token.json!");
}

let drive = null;

// 🔹 Load token if exists; never block server startup with an interactive prompt
if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  console.log("\n✅ token.json loaded successfully!");
} else {
  if (process.env.GOOGLE_AUTH_INTERACTIVE === 'true') {
    getAccessToken().catch((error) => {
      console.error("Google auth initialization failed:", error.message);
    });
  } else {
    console.warn("Google Drive auth skipped: token.json not found and interactive auth is disabled.");
  }
}

// 🔹 Export drive
if (oAuth2Client.credentials && Object.keys(oAuth2Client.credentials).length > 0) {
  drive = google.drive({ version: "v3", auth: oAuth2Client });
}
module.exports = { drive };



// const fs = require("fs");
// const { google } = require("googleapis");
// const readline = require("readline");

// const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
// const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed;

// // const oAuth2Client = new google.auth.OAuth2(
// //   client_id,
// //   client_secret,
// //   redirect_uris[0]
// // );

// const oAuth2Client = new google.auth.OAuth2(
//   client_id,
//   client_secret,
//   "urn:ietf:wg:oauth:2.0:oob"
// );


// const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

// async function getAccessToken() {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });

//   console.log("\n👉 Go to this URL and authorize this app:\n");
//   console.log(authUrl);

//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   const code = await new Promise((resolve) => {
//     rl.question("\nEnter the code from that page here: ", (input) => {
//       rl.close();
//       resolve(input);
//     });
//   });

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);
//     fs.writeFileSync("token.json", JSON.stringify(tokens));
//     console.log("\n✅ Token stored successfully in token.json!");
//   } catch (err) {
//     console.error("❌ Error retrieving access token:", err.message);
//   }
// }

// getAccessToken();
