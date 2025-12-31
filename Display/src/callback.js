
import {
  getAccessToken,
  saveToken
} from "./fcns.js";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
  // No code? Send user back to login
  window.location.href = "./index.html";
}

const tokenData = await getAccessToken(clientId, code);
saveToken(tokenData, 3600)

window.location.href = "./index.html";
