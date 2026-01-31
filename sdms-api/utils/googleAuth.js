
const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");

const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
const { client_secret, client_id } = CREDENTIALS.installed;

const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

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

// 🔹 Load token if exists, otherwise generate
if (fs.existsSync(TOKEN_PATH)) {
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  console.log("\n✅ token.json loaded successfully!");
} else {
  getAccessToken(); // run only once
}

// 🔹 Export drive
const drive = google.drive({ version: "v3", auth: oAuth2Client });
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
