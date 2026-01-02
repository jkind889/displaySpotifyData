import {
  fetchRecents
} from "./fcns.js";

const token = localStorage.getItem("spotify_access_token")
console.log(token)
export async function initApp(token)
{
    const tracks = await fetchRecents(token)
    const groupedartists= tracks.items.map(item => ({
        album: item.track.album,
        title: item.track.name,
        artists: item.track.artists.map(a => a.name)
    }));
    displayRecent(groupedartists);
}


export function displayRecent(tracks)
{
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
    
