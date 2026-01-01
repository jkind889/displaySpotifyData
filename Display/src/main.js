import {
  redirectToAuthCodeFlow,
  clearAuth
} from "./fcns.js";
import
{
    initApp
} from "./index.js"

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const accessToken = localStorage.getItem("spotify_access_token");
const expiresAt = Number(localStorage.getItem("spotify_expires_at"));

const loginBtn = document.getElementById("login");
if (!accessToken || Date.now() > expiresAt) {
  // NOT logged in
  clearAuth();
  if (loginBtn) {
    loginBtn.style.display = "block";
    loginBtn.addEventListener("click", () => {
      redirectToAuthCodeFlow(clientId);
    });
  }
} else {
  // logged in
  if (loginBtn) loginBtn.style.display = "none";
  initApp(accessToken)
}



