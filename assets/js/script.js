// set up global variables
var statEl1 = document.querySelector("#city1Stats");
var statEl2 = document.querySelector("#city2Stats");

var formOneEl = document.querySelector("#formOne");

var savedCityEl = document.querySelector("#savedCity");
var versusStatsEl = document.querySelector("#versusStats");


var lastCities = []

var teamName = []

var lastGame = []

// does 4 api calls to get our stats for the two teams
async function getStats(city) {

// first call to get the data for the team by city
    const response = await fetch("https://api-nba-v1.p.rapidapi.com/teams?search=" + city, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
          "x-rapidapi-key": "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8",
        },
      }).catch((err) => {
        console.error(err);
      });
//  saves the city name and gets the teamname(which is city and then name together) and saves it globally
      const data = await response.json()
      var city = data.response[0].city
      teamName.push(data.response[0].name)

    //   second fetch using the team id
      const response2 = await fetch(
        "https://api-nba-v1.p.rapidapi.com/teams/statistics?id=" +
          data.response[0].id +
          "&season=2021",
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
            "x-rapidapi-key":
              "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8",
          },
        }
      ).catch((err) => {
        console.error(err);
      });
const data2 = await response2.json()
// returns the city name and the data as an object
return {data2,city}

}

// this lets me show all the stats on the page!
async function showStats(city1, city2) {
    // empties team array in case we call getStats a second time without reloading the page
    teamName = []
  var [stats1, stats2] = await Promise.all([
    getStats(city1),
    getStats(city2),
  ]);
//   console.log(firstResult);
//   console.log(secondResult);
var dataTwo = await fetch('https://www.thesportsdb.com/api/v1/json/2/searchevents.php?e='+teamName[0]+'_vs_'+teamName[1]);
const data = await dataTwo.json();
lastGame = data.event[0];
versusStats(lastGame);
  // adds city names to their respective containers
  statEl2.replaceChildren("");
  statEl1.replaceChildren("");
  var city1NameEl = document.createElement("h2");
  var city2NameEl = document.createElement("h2");
  city1NameEl.textContent = stats1.city;
  city2NameEl.textContent = stats2.city;
  statEl1.appendChild(city1NameEl);
  statEl2.appendChild(city2NameEl);

  // for loop to run over each key value pair in the response
  for (i = 0; i < Object.keys(stats1.data2.response[0]).length; i++) {
    var currentStat1El = document.createElement("p");
    var currentStat2El = document.createElement("p");
    //  Right now this just shows the key and then the value, but if we want we can try to be more descriptive, maybe
    currentStat1El.textContent =
      Object.keys(stats1.data2.response[0])[i] +
      ": " +
      Object.values(stats1.data2.response[0])[i];
    currentStat2El.textContent =
      Object.keys(stats2.data2.response[0])[i] +
      ": " +
      Object.values(stats2.data2.response[0])[i];

    // here is where it checks the values against each other for conditionals and color coding
    if (
      Object.values(stats1.data2.response[0])[i] >
      Object.values(stats2.data2.response[0])[i]
    ) {
      currentStat1El.classList.add("green");
      currentStat2El.classList.add("red");
      currentStat1El.style.fontWeight = "bold";
    } else if (
      Object.values(stats1.data2.response[0])[i] <
      Object.values(stats2.data2.response[0])[i]
    ) {
      currentStat1El.classList.add("red");
      currentStat2El.classList.add("green");
      currentStat2El.style.fontWeight = "bold";
    } else if (
      Object.values(stats1.data2.response[0])[i] ===
      Object.values(stats2.data2.response[0])[i]
    ) {
      currentStat1El.classList.add("blue");
      currentStat2El.classList.add("blue");
      currentStat1El.style.fontWeight = "bold";
      currentStat2El.style.fontWeight = "bold";
    }
    statEl1.appendChild(currentStat1El);
    statEl2.appendChild(currentStat2El);
  }
  console.log(teamName)
}

var versusStats = function(lastGame) {
  console.log(lastGame);
  var lastGameEl = document.createElement("div");
  lastGameEl.innerHTML = "<h2>Laast Game ()</h2><h3>" + lastGame.strEventAlternate + "</h3<p><h4>" + lastGame.strHomeTeam + " : " + lastGame.intHomeScore + " ||| " + lastGame.intAwayScore + " : " + lastGame.strAwayTeam + "</h4>";
  console.log(lastGameEl);
  versusStatsEl.appendChild(lastGameEl);
}

// check form and submit cities
var submitCities = function(submitForm) {
    submitForm.preventDefault();
    var city1Name = document.querySelector("#searchBox1").value.trim();
    var city2Name = document.querySelector("#searchBox2").value.trim();
    // console.log(city1Name);
    // console.log(city2Name);
        if (!city1Name || !city2Name) {
        alert("You haven't entered both team names!");
    } else {

        storeCities(city1Name, city2Name);

        showStats(city1Name, city2Name);
    }
}

// autocomplete cities that have NBA teams
$(function () {
    var availableTags = [
        "Atlanta",
        "Boston",
        "Brooklyn",
        "Charlotte",
        "Chicago",
        "Cleveland",
        "Dallas",
        "Denver",
        "Detroit",
        "San Francisco",
        "Houston",
        "Indianapolis",
        "Los Angeles",
        "Memphis",
        "Miami",
        "Milwaukee",
        "Minneapolis",
        "New Orleans",
        "New York",
        "Oklahoma City",
        "Orlando",
        "Philadelphia",
        "Phoenix",
        "Portland",
        "Sacramento",
        "San Antonio",
        "Toronto",
        "Salt Lake City",
        "Washington"
    ];
    $(".auto-complete").autocomplete({
        source: availableTags
    });
});

// save to localstorage
var storeCities = function(city1Name, city2Name) {
  var lastCity = {city1Name,city2Name}
    lastCities.push(lastCity);
    localStorage.setItem("lastcities", JSON.stringify(lastCities));
     writeCities(city1Name,city2Name);
}

// load from localstorage
var loadCities = function() {
  savedCityEl.innerHTML ="<h3>Previous Searches</h3>";
    lastCities = JSON.parse(localStorage.getItem("lastcities"));
    // check to see if data exists
    if (lastCities) {
        // console.log(lastCities.city1Name, lastCities.city2Name);
        for (i=0;i<lastCities.length;i++) {
          writeCities(lastCities[i].city1Name, lastCities[i].city2Name);
        }
        // 
         console.log(lastCities)
    }  
    else {
      lastCities = []
}
}

// write last set of cities to page
var writeCities = function(city1Name, city2Name) {
   
    var cityListEl = document.createElement("ul");
    cityListEl.innerHTML = "<li class='pure-button'><span class='city1' >" + city1Name + " </span> vs <span class = 'city2' >" + city2Name + "</span></li>";
    savedCityEl.appendChild(cityListEl);

}


function loadSavedSearch(event) {
  if (event.target.classList =='city1') {
  var city1 = event.target.textContent
  var city2 = event.target.nextElementSibling.textContent
  }

  else if (event.target.classList =='city2') {
    city1 = event.target.previousElementSibling.textContent
    city2 = event.target.textContent
    }
    else {
      return
    }
    showStats(city1,city2)
}

   savedCityEl.addEventListener("click", function(event){loadSavedSearch(event)});
// test run of the function
// showStats("atlanta", "new york");

// listens for submit event
formOneEl.addEventListener("submit", submitCities);

// call to run localscorage check on load
loadCities();