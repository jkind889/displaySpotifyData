import
{
    fetchhightracks,
    getStoredToken,
    isTokenExpired

} from "./fcns.js";

const token = getStoredToken();
if(!token || isTokenExpired())
{
    window.location.href="./index.html";

}else{
    loadPage(token)
}

async function loadPage(token)
{
    const longtracks = await fetchhightracks(token,"long_term");
    const midtracks = await fetchhightracks(token,"medium_term");
    const shortracks = await fetchhightracks(token,"short_term");

    const groupedshort = groupTracks(shortracks);
    const groupedmid = groupTracks(midtracks);
    const groupedlong = groupTracks(longtracks);
    console.log(groupedlong);
    

    const tabs = document.querySelectorAll('[data-tab-target]')
    const tabContents = document.querySelectorAll('[data-tab-content]')
    tabs.forEach(tab => {
        tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.tabTarget)
        if(target.id === "fourweeks")
        {
            displayTopTracks(groupedshort, "4body")
        }
        else if(target.id === "sixmonths")
        {
            displayTopTracks(groupedmid,"6body")
        }
        else
        {
            displayTopTracks(groupedlong,"onebody")
        }

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')
        
        })
})
}

function groupTracks(timeRange)
{
return timeRange.items.map(item =>({
album: item.album.name,
title: item.name,
artists: item.artists.map(a=> a.name)
}));

}
// thinking if statements and be like if 4weeks then append to 4weeks
function displayTopTracks(timeRange, tableid)
{   
    const tb = document.getElementById(tableid)


    for(const track of timeRange)
    {
        
        const tr = document.createElement("tr")
        const tdAlbum = document.createElement("td")
        tdAlbum.innerText = track.album
        const tdTitle = document.createElement("td")
        tdTitle.innerText = track.title
        const tdArtists = document.createElement("td")
        tdArtists.innerText = track.artists
        tr.appendChild(tdTitle);
        tr.appendChild(tdArtists);
        tr.appendChild(tdAlbum);

        tb.appendChild(tr);
    }
}