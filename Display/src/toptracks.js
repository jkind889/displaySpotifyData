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
    const midtracks = await fetchhightracks(token,"mid_term");
    const shortracks = await fetchhightracks(token,"short_term");

    const groupedshort = groupTracks(shortracks);
    const groupedmid = groupTracks(midtracks);
    const groupedlong = groupTracks(longtracks);

    const tabs = document.querySelectorAll('[data-tab-target]')
    const tabContents = document.querySelectorAll('[data-tab-content]')
    tabs.forEach(tab => {
        tab.addEventListener('click', () =>{
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')
        //func call will be here
        })
})
}

function groupTracks(timeRange)
{
return timeRange.items.map(item =>({
album: item.album,
title: item.name,
artists: item.artists.map(a=> a.name)
}));

}