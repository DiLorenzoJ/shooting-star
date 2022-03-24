var statEl1 = document.querySelector("#city1Stats");
var statEl2 = document.querySelector("#city2Stats");
// sets stats as global since I call them in two functions

var formOneEl = document.querySelector("#formOne");

var teamName = []
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
var data = await fetch('https://www.thesportsdb.com/api/v1/json/2/searchevents.php?e='+teamName[0]+'_vs_Atlanta%20Hawks')
console.log(data)
  // adds city names to their respective containers
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


// check form and submit cities
var submitCities = function(submitForm) {
    submitForm.preventDefault();
    var city1Name = document.querySelector("#searchBox1").value.trim();
    var city2Name = document.querySelector("#searchBox2").value.trim();
    console.log(city1Name);
    console.log(city2Name);
        if (!city1Name || !city2Name) {
        alert("You haven't entered your name!");
    } else {
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
        "New York City",
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

// test run of the function
// showStats("atlanta", "new york");

formOneEl.addEventListener("submit", submitCities);