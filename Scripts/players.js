const ALL_FANTASY_DATA_API_URL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
const SPECIFIC_FANTASY_PLAYER_API_URL = 'https://fantasy.premierleague.com/api/element-summary/'
const SPECIFIC_FANTASY_PLAYER_PICTURE_URL = 'https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p'
const proxy = 'https://cors-anywhere.herokuapp.com/'
const modal = document.getElementById('modal');
const modalHeader = document.getElementById('modal-header')
const modalHeaderTop = document.getElementById('modal-header1')
const topPlayerCard1 = document.getElementById('topCard1')
const topPlayerCard2 = document.getElementById('topCard2')
const topPlayerCard3 = document.getElementById('topCard3')
const topPlayerCard4 = document.getElementById('topCard4')
const topPlayerCard5 = document.getElementById('topCard5')
const topPlayerCard6 = document.getElementById('topCard6')
const topPlayerCard7 = document.getElementById('topCard7')
const topPlayerCard8 = document.getElementById('topCard8')
const topPlayerCard9 = document.getElementById('topCard9')
const popularPlayerCard1 = document.getElementById('popularCard1')
const popularPlayerCard2 = document.getElementById('popularCard2')
const popularPlayerCard3 = document.getElementById('popularCard3')
const popularPlayerCard4 = document.getElementById('popularCard4')
const popularPlayerCard5 = document.getElementById('popularCard5')
const popularPlayerCard6 = document.getElementById('popularCard6')
const popularPlayerCard7 = document.getElementById('popularCard7')
const popularPlayerCard8 = document.getElementById('popularCard8')
const popularPlayerCard9 = document.getElementById('popularCard9')
const stats = document.getElementById('stats-list')
const search = document.getElementById('search');
const matchList = document.getElementById('list')

let fantasyData;
let allPlayers;
let currentPlayerInfo;
let currentPlayerHistory;
let teams;


function fetchAllFantasyData() {
    return fetch(proxy + ALL_FANTASY_DATA_API_URL )
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
    await setPlayerHistory(currentPlayerInfo.id)
    console.log(currentPlayerHistory)
    stats.innerHTML = ''
    setStats()
    $("#myModal").modal("toggle")
}
//Setting the stats
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

    let scrollFixtures = document.createElement("div")
    scrollFixtures.className = "scrollmenu"
    
    console.log(currentPlayerHistory.fixtures)
    currentPlayerHistory.fixtures.forEach((fixture) => {
        let otherTeam;
        let otherTeamName;
        otherTeam = (fixture.is_home) ? fixture.team_a : fixture.team_h;
        teams.forEach(team => 
            {
                 if (team.id === otherTeam) {
                   otherTeamName = team.name;
                   let fixtureHTML = document.createElement('span')
                   if (fixture.difficulty === 5 || fixture.difficulty === 4) fixtureHTML.className = 'bg-danger'
                   if (fixture.difficulty === 3) fixtureHTML.className = 'bg-warning'
                   if (fixture.difficulty === 1 || fixture.difficulty === 2) fixtureHTML.className = 'bg-success'
                   fixtureHTML.innerHTML = `<a href="#">GW ${fixture.event} <br>${otherTeamName}</a>`
                  scrollFixtures.appendChild(fixtureHTML)
                 }
                   
                
            }
            )

        
    })
    stats.appendChild(scrollFixtures)
    
    
}

async function fetchPlayerHistory(code) {
    return await fetch(proxy + SPECIFIC_FANTASY_PLAYER_API_URL+code+'/')
    .then((response) => response.json())
    .then((json) =>  json)
    
}

async function setPlayerHistory(code) {
        currentPlayerHistory= await fetchPlayerHistory(code)
}

async function getAllPlayers() {
    await fetchAllFantasyData();
    allPlayers = fantasyData.elements;
    
}

async function getTopPlayers() {
    
    fantasyData = await fetchAllFantasyData();
    console.log(fantasyData)
    await getAllPlayers()


   let topPlayers = allPlayers.sort(function(player1, player2) {
        return player2.total_points - player1.total_points
    })

    const [player1, player2, player3, player4, player5, player6, player7, player8, player9] = topPlayers

    topPlayerCard1.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player1.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player1.first_name} ${player1.second_name}</h2> 
                                <h4>$${player1.now_cost/10}</h4>
                                <hr>
                                <p>${player1.web_name} has scored <strong>${player1.goals_scored}</strong> goals
                                and has accumulated <strong>${player1.total_points}</strong> points this season.</p>
                                
                                
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
                                
    topPlayerCard4.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player4.code}.png" alt="" width="128" height="128" class=" mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player4.first_name} ${player4.second_name}</h2> 
                                <h4>$${player4.now_cost/10}</h4>
                                <hr>
                                <p>${player4.web_name} has scored <strong>${player4.goals_scored}</strong> goals
                                and has accumulated <strong>${player4.total_points}</strong> points this season.</p>
                                
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player4.web_name}');">More Info</button>
                                
                                `
                                
                                

    topPlayerCard5.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player5.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player5.first_name} ${player5.second_name}</h2> 
                                <h4>$${player5.now_cost/10}</h4>
                                <hr>
                                <p>${player5.web_name} has scored <strong>${player5.goals_scored}</strong> goals 
                                and has accumulated <strong>${player5.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player5.web_name}');">More Info</button>
                                
                                `
                                

    topPlayerCard6.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player6.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player6.first_name} ${player6.second_name}</h2> 
                                <h4>$${player6.now_cost/10}</h4>
                                <hr>
                                <p>${player6.web_name} has scored <strong>${player6.goals_scored}</strong> goals 
                                and has accumulated <strong>${player6.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player6.web_name}');">More Info</button>
                                
                               `
    topPlayerCard7.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player7.code}.png" alt="" width="128" height="128" class=" mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player7.first_name} ${player7.second_name}</h2> 
                                <h4>$${player7.now_cost/10}</h4>
                                <hr>
                                <p class="list-inline">${player7.web_name} has scored <strong>${player7.goals_scored}</strong> goals
                                and has accumulated <strong>${player7.total_points}</strong> points this season.</p>
                                
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player7.web_name}');">More Info</button>
                                
                                `
                                
                                

    topPlayerCard8.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player8.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player8.first_name} ${player8.second_name}</h2> 
                                <h4>$${player8.now_cost/10}</h4>
                                <hr>
                                <p class="list-inline">${player8.web_name} has scored <strong>${player8.goals_scored}</strong> goals 
                                and has accumulated <strong>${player8.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player8.web_name}');">More Info</button>
                                
                                `
                                

    topPlayerCard9.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player9.code}.png" alt="" width="128" height="128" class="mx-auto">               
                                <div style="margin-top:10px"></div>
                                <h2>${player9.first_name} ${player9.second_name}</h2> 
                                <h4>$${player9.now_cost/10}</h4>
                                <hr>
                                <p class="list-inline">${player9.web_name} has scored <strong>${player9.goals_scored}</strong> goals 
                                and has accumulated <strong>${player9.total_points}</strong> points this season.</p>
                                
                                <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player9.web_name}');">More Info</button>`
                                

}

async function getPopularPlayers() {
    fantasyData = await fetchAllFantasyData();
    await getAllPlayers()


   let popularPlayers = allPlayers.sort(function(player1, player2) {
        return (player2.transfers_in_event -player2.transfers_out_event)- (player1.transfers_in_event -player1.transfers_out_event)
    })

    const [player1, player2, player3, player4, player5, player6, player7, player8, player9] = popularPlayers


    popularPlayerCard1.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player1.code}.png" alt="" width="128" height="128" class="mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player1.first_name} ${player1.second_name}</h2> 
    <h4>$${player1.now_cost/10}</h4>
    <hr>
    <p>${player1.web_name} has scored <strong>${player1.goals_scored}</strong> goals
    and has accumulated <strong>${player1.total_points}</strong> points this season.</p>
    
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player1.web_name}');">More Info</button>
    
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
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player3.web_name}');">More Info</button>
    `
    
popularPlayerCard4.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player4.code}.png" alt="" width="128" height="128" class=" mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player4.first_name} ${player4.second_name}</h2> 
    <h4>$${player4.now_cost/10}</h4>
    <hr>
    <p>${player4.web_name} has scored <strong>${player4.goals_scored}</strong> goals
    and has accumulated <strong>${player4.total_points}</strong> points this season.</p>
    
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player4.web_name}');">More Info</button>
    
    `
    
    

popularPlayerCard5.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player5.code}.png" alt="" width="128" height="128" class="mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player5.first_name} ${player5.second_name}</h2> 
    <h4>$${player5.now_cost/10}</h4>
    <hr>
    <p>${player5.web_name} has scored <strong>${player5.goals_scored}</strong> goals 
    and has accumulated <strong>${player5.total_points}</strong> points this season.</p>
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player5.web_name}');">More Info</button>
    
    `
    

popularPlayerCard6.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player6.code}.png" alt="" width="128" height="128" class="mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player6.first_name} ${player6.second_name}</h2> 
    <h4>$${player6.now_cost/10}</h4>
    <hr>
    <p>${player6.web_name} has scored <strong>${player6.goals_scored}</strong> goals 
    and has accumulated <strong>${player6.total_points}</strong> points this season.</p>
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player6.web_name}');">More Info</button>
    
   `
popularPlayerCard7.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player7.code}.png" alt="" width="128" height="128" class=" mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player7.first_name} ${player7.second_name}</h2> 
    <h4>$${player7.now_cost/10}</h4>
    <hr>
    <p>${player7.web_name} has scored <strong>${player7.goals_scored}</strong> goals
    and has accumulated <strong>${player7.total_points}</strong> points this season.</p>
    
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player7.web_name}');">More Info</button>
    
    `
    
    

popularPlayerCard8.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player8.code}.png" alt="" width="128" height="128" class="mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player8.first_name} ${player8.second_name}</h2> 
    <h4>$${player8.now_cost/10}</h4>
    <hr>
    <p>${player8.web_name} has scored <strong>${player8.goals_scored}</strong> goals 
    and has accumulated <strong>${player8.total_points}</strong> points this season.</p>
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player8.web_name}');">More Info</button>
    
    `
    
popularPlayerCard9.innerHTML = `<img src="${SPECIFIC_FANTASY_PLAYER_PICTURE_URL}${player9.code}.png" alt="" width="128" height="128" class="mx-auto">               
    <div style="margin-top:10px"></div>
    <h2>${player9.first_name} ${player9.second_name}</h2> 
    <h4>$${player9.now_cost/10}</h4>
    <hr>
    <p>${player9.web_name} has scored <strong>${player9.goals_scored}</strong> goals 
    and has accumulated <strong>${player9.total_points}</strong> points this season.</p>
    
    <button type="button" class="btn btn-block btn-primary mt-auto" onclick="showModal('${player9.web_name}');">More Info</button>`
    
    

    

}

async function getFixtures() {
    fantasyData = await fetchAllFantasyData();
    teams = fantasyData.teams
    console.log(teams)
}

async function getPlayerInfo(name) {
    await getAllPlayers();
    allPlayers.forEach(element => 
        {
            if(element.web_name === name) { 
               currentPlayerInfo = element;
               
            }
        }
        )
    
}




getTopPlayers()
getPopularPlayers()
getFixtures()


