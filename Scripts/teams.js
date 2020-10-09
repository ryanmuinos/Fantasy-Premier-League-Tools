function fetchAllFantasyData() {
    return fetch(ALL_FANTASY_DATA_API_URL )
    .then((response) => response.json())
    .then((json) =>  json);
}
