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