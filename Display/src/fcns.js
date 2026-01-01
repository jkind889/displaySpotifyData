export function saveToken(token, expiresInSeconds) {
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem("spotify_access_token", token);
  localStorage.setItem("spotify_expires_at", expiresAt);
}

export function clearAuth() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_expires_at");
  localStorage.removeItem("verifier");
}


export function getStoredToken() {
  return localStorage.getItem("spotify_access_token");
}

export function isTokenExpired() {
  const expiresAt = localStorage.getItem("spotify_expires_at");
  return !expiresAt || Date.now() > Number(expiresAt);
}

export function clearToken() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_expires_at");
}


export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/callback.html");
    params.append("scope", "user-read-private user-read-email user-top-read user-read-recently-played");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


export async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/callback.html");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;

    
}



export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

export async function fetchArtists(token)
{
    const result = await fetch("https://api.spotify.com/v1/me/top/artists", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json();
    
}

export async function fetchAlbums(token)
{
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=40&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });

    return await result.json();

}

export async function fetchRecents(token)
{
    const result = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50",
        {
            method: "GET", headers: { Authorization: `Bearer ${token}`}
        });

    return await result.json();
}
export async function fetchhightracks(token,timeRange)
{
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50&offset=0",
        {
            method: "GET", headers: { Authorization: `Bearer ${token}`}
        });

    return await result.json();
}

