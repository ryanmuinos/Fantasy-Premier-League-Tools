const ALL_FANTASY_DATA_API_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
const SPECIFIC_FANTASY_PLAYER_API_URL = 'https://fantasy.premierleague.com/api/element-summary/'
const SPECIFIC_FANTASY_PLAYER_PICTURE_URL = 'https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p'

const modal = document.getElementById('modal');
const modalHeader = document.getElementById('modal-header')
const modalHeaderTop = document.getElementById('modal-header1')
const topPlayerCard1 = document.getElementById('topCard1')
const topPlayerCard2 = document.getElementById('topCard2')
const topPlayerCard3 = document.getElementById('topCard3')
const popularPlayerCard1 = document.getElementById('popularCard1')
const popularPlayerCard2 = document.getElementById('popularCard2')
const popularPlayerCard3 = document.getElementById('popularCard3')
const stats = document.getElementById('stats-list')
const search = document.getElementById('search');
const matchList = document.getElementById('list')

let fantasyData;
let allPlayers;
let currentPlayerInfo;
let currentPlayerHistory;


function fetchAllFantasyData() {
    return fetch(ALL_FANTASY_DATA_API_URL )
    .then((response) => response.json())
    .then((json) =>  json);
}



search.addEventListener('input', () => searchStates(search.value))

const searchStates = async searchText => {
    await getAllPlayers();
    
    //Get matches to current text input
    let matches = allPlayers.filter(player => {
        const regex = new RegExp(`^${searchText}`, 'gi')
        return player.web_name.match(regex) || player.first_name.match(regex) || player.second_name.match(regex)
    })
    if (searchText === '') {
        matches = {};
        matchList.innerHTML = '';
    }
    
    matchList.innerHTML = ''
    outputHtml(matches)
}

const outputHtml = matches => {
    
    if(matches.length > 0) {
         matches.forEach(match => {
             console.log(match)
             let li = document.createElement("li")
             li.innerHTML = `<li class="list-group-item">
                <a href="#" onclick="showModal('${match.web_name}');"><img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${match.code}.png" alt="" width="48" height="48">
                &nbsp;&nbsp;&nbsp;${match.first_name} ${match.second_name} 
                </li>`
            matchList.appendChild(li)
         } )
    } 

}


async function showModal(web_name){
    
    await getPlayerInfo(web_name)
    stats.innerHTML = ''
    setStats()
    $("#myModal").modal("toggle")
}

function setStats() {
    modalHeaderTop.innerHTML =    
    `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${currentPlayerInfo.code}.png" alt="" width="64" height="64">               
    <span id="modal-header" class="text-center"> <strong>${currentPlayerInfo.first_name} ${currentPlayerInfo.second_name}</strong> </span>
    <button type="button" class="close" data-dismiss="modal">×</button>`
    //Price
    let li = document.createElement("li")
    li.innerHTML = `<li class="list-group-item">
    <strong>Price</strong> ${currentPlayerInfo.now_cost/10}
    </li>`
    stats.appendChild(li)
    //Form
    li = document.createElement("li")
    li.innerHTML = `<li class="list-group-item">
    <strong>Goals</strong> <span mr-0>${currentPlayerInfo.goals_scored}</span>
    </li>`
    stats.appendChild(li)
    
}

function fetchPlayerHistory(code) {
    return fetch(SPECIFIC_FANTASY_PLAYER_API_URL+code+'/')
    .then((response) => response.json())
    .then((json) =>  json)
}

async function getAllPlayers() {
    await fetchAllFantasyData();
    allPlayers = fantasyData.elements;
    
}

async function getTopPlayers() {
    fantasyData = await fetchAllFantasyData();
    await getAllPlayers()


   let topPlayers = allPlayers.sort(function(player1, player2) {
        return player2.total_points - player1.total_points
    })

    let player1 = topPlayers[0]
    let player2 = topPlayers[1]
    let player3 = topPlayers[2]

    topPlayerCard1.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player1.code}.png" alt="" width="128" height="128" class=" mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player1.first_name} ${player1.second_name}</h2> 
                                <h4>$${player1.now_cost/10}</h4>
                                <hr>
                                <p>${player1.web_name} has scored <strong>${player2.goals_scored}</strong> goals
                                and has accumulated <strong>${player2.total_points}</strong> points this season.</p>
                                
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player1.web_name}');">More Info</button>
                                
                                `
                                
                                

    topPlayerCard2.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player2.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player2.first_name} ${player2.second_name}</h2> 
                                <h4>$${player2.now_cost/10}</h4>
                                <hr>
                                <p>${player2.web_name} has scored <strong>${player2.goals_scored}</strong> goals 
                                and has accumulated <strong>${player2.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player2.web_name}');">More Info</button>
                                
                                `
                                

    topPlayerCard3.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player3.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player3.first_name} ${player3.second_name}</h2> 
                                <h4>$${player3.now_cost/10}</h4>
                                <hr>
                                <p>${player3.web_name} has scored <strong>${player3.goals_scored}</strong> goals 
                                and has accumulated <strong>${player3.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player3.web_name}');">More Info</button>
                                
                                `
                                



    

}

async function getPopularPlayers() {
    fantasyData = await fetchAllFantasyData();
    await getAllPlayers()


   let popularPlayers = allPlayers.sort(function(player1, player2) {
        return (player2.transfers_in_event -player2.transfers_out_event)- (player1.transfers_in_event -player1.transfers_out_event)
    })

    let player1 = popularPlayers[0]
    let player2 = popularPlayers[1]
    let player3 = popularPlayers[2]

    popularPlayerCard1.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player1.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player1.first_name} ${player1.second_name}</h2> 
                                <h4>$${player1.now_cost/10}</h4>
                                <hr>
                                <p>${player1.web_name} has scored <strong>${player2.goals_scored}</strong> goals
                                and has accumulated <strong>${player2.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player2.web_name}');">More Info</button>
                                `
                                
                                

    popularPlayerCard2.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player2.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player2.first_name} ${player2.second_name}</h2> 
                                <h4>$${player2.now_cost/10}</h4>
                                <hr>
                                <p>${player2.web_name} has scored <strong>${player2.goals_scored}</strong> goals 
                                and has accumulated <strong>${player2.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player2.web_name}');">More Info</button>
                                `
                                

    popularPlayerCard3.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player3.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player3.first_name} ${player3.second_name}</h2> 
                                <h4>$${player3.now_cost/10}</h4>
                                <hr>
                                <p>${player3.web_name} has scored <strong>${player3.goals_scored}</strong> goals 
                                and has accumulated <strong>${player3.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player2.web_name}');">More Info</button>
                                `
                                



    

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


getTopPlayers()
getPopularPlayers()


