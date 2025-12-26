import { fetchProfile,fetchArtists,fetchAlbums,fetchRecents } from "./fcns";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
console.log(clientId)
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

let loginbtn = document.getElementById("login")


if (!code) {
   loginbtn.addEventListener("click", () =>
   {
      redirectToAuthCodeFlow(clientId)
   });


} else {
  const accessToken = await getAccessToken(clientId, code);
  const tracks= await fetchRecents(accessToken);
  const groupedartists= tracks.items.map(item => ({
        album: item.track.album,
        title: item.track.name,
        artists: item.track.artists.map(a => a.name)
    }));
  displayRecent(groupedartists);
}

export async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
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
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}


export function displayRecent(tracks)
{
    const table = document.getElementById("table");
    const tb= document.getElementById("body");
    const albs = {};

    for(const track of tracks)
    {
        const id = track.album.id

        albs[id] =
        {
            albtitle: track.album.name,
            title: track.title,
            artists: track.artists
        }

    }

    const info = Object.values(albs);
    
    for(const album of info)
    {
        const tr = document.createElement("tr")
        const tdAlbum = document.createElement("td")
        tdAlbum.innerText = album.albtitle
        const tdTitle = document.createElement("td")
        tdTitle.innerText = album.title
        const tdArtists = document.createElement("td")
        tdArtists.innerText = album.artists
        tr.appendChild(tdTitle);
        tr.appendChild(tdArtists);
        tr.appendChild(tdAlbum);

        tb.appendChild(tr)
        
    }
}