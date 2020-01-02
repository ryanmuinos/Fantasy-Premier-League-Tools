const ALL_FANTASY_DATA_API_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
const SPECIFIC_FANTASY_PLAYER_API_URL = 'https://fantasy.premierleague.com/api/element-summary/'
const SPECIFIC_FANTASY_PLAYER_PICTURE_URL = 'https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p'
const search = document.getElementById('search');
const matchList = document.getElementById('match-list')


let allPlayers;
let currentPlayerInfo;
let currentPlayerHistory;


const searchStates = async searchText => {
    await getAllPlayers();
    
    //Get matches to current text input
    let matches = allPlayers.filter(player => {
        const regex = new RegExp(`^${searchText}`, 'gi')
        return player.web_name.match(regex) || player.first_name.match(regex) || player.second_name.match(regex)
    })
    if (searchText === 0) {
        matches = {};
        matchList.innerHTML = '';
    }
    
    outputHtml(matches)
}

const outputHtml = matches => {
    if(matches.length > 0) {
        const html = matches.map(match => 
                
            `<div class="card card-body mb-1">
                <span style="display:inline;"><img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${match.code}.png" alt="" width="32" height="32"><\span>
                <span>${match.first_name} ${match.second_name} <span>
            <div>
            
            `).join('')
            matchList.innerHTML = html
    } else {
        matchList.innerHTML = ''
    }
    

}
search.addEventListener('input', () => searchStates(search.value))

function fetchAllFantasyData() {
    return fetch(ALL_FANTASY_DATA_API_URL )
    .then((response) => response.json())
    .then((json) =>  json)
}

function fetchPlayerHistory(code) {
    return fetch(SPECIFIC_FANTASY_PLAYER_API_URL+code+'/')
    .then((response) => response.json())
    .then((json) =>  json)
}

async function getAllPlayers() {
    const data = await fetchAllFantasyData()
    allPlayers = data.elements
    
}

async function getPlayerInfo(name) {
    const players = await fetchAllFantasyData();
    players.elements.forEach(element => 
        {
            if(element.web_name === name) { 
               currentPlayerInfo = element;
               
            }
        }
        )
    
}
async function logPlayerGoals(name) {
    await getPlayerInfo('Lundstram')
    console.log(currentPlayerInfo.goals_scored)
}

