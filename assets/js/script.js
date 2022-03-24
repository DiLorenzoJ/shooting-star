var statEl1= document.querySelector("#city1Stats")
var statEl2= document.querySelector("#city2Stats")
// sets stats as global since I call them in two functions
var stats1=''
var stats2=''
var promiseArray = []
var responseArray = []
// does 4 api calls to get our stats for the two teams
function getStats(city1,city2) {
    promiseArray.push("city1")
    //  first fetch takes the city name and searches for a team so I can get its id, because it looks like the stats page needs team id and not the team city.
    fetch("https://api-nba-v1.p.rapidapi.com/teams?search="+city1, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
		"x-rapidapi-key": "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8"
	}
})
.then(response => {
	response.json().then(function(data){
        // take the city name because its always capitalized
        city1 = data.response[0].city 
    //    so I take the id and then get the stats for the team, 
        fetch("https://api-nba-v1.p.rapidapi.com/teams/statistics?id=" + data.response[0].id + "&season=2021", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
                "x-rapidapi-key": "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8"
            }
        })
        .then(response => {
            // I save the stats in a variable and then I run the same 2 calls again but for the second city, at the end running showStats
            response.json().then(function(data){
stats1=data
responseArray.push("city1")
showStats(city1,city2)
            })
        })
        .catch(err => {
            console.error(err);
        });

    });
})
.catch(err => {
	console.error(err);
});
promiseArray.push("city2")
fetch("https://api-nba-v1.p.rapidapi.com/teams?search="+city2, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
		"x-rapidapi-key": "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8"
	}
})
.then(response => {
	response.json().then(function(data){
       city2 = data.response[0].city
        fetch("https://api-nba-v1.p.rapidapi.com/teams/statistics?id=" + data.response[0].id + "&season=2021", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
                "x-rapidapi-key": "2d7170db45mshc002aca3b426819p1fb5b5jsn7f819f5ce9c8"
            }
        })
        .then(response => {
            response.json().then(function(data){
                console.log(data)
                // heres where I end up showing the stats, and I pass through both cities still 
stats2=data
responseArray.push("city2")
showStats(city1,city2)
            })
        })
        .catch(err => {
            console.error(err);
        });

    });
})
.catch(err => {
	console.error(err);
});


}


// this lets me show all the stats on the page!
function showStats(city1,city2){
if (responseArray.length===promiseArray.length){

// adds city names to their respective containers
var city1NameEl = document.createElement("h2")
var city2NameEl = document.createElement("h2")
city1NameEl.textContent = city1
city2NameEl.textContent=city2
statEl1.appendChild(city1NameEl)
statEl2.appendChild(city2NameEl)

// for loop to run over each key value pair in the response
for (i=0;i<Object.keys(stats1.response[0]).length;i++) {
    var currentStat1El = document.createElement("p")
    var currentStat2El = document.createElement("p")
//  Right now this just shows the key and then the value, but if we want we can try to be more descriptive, maybe
currentStat1El.textContent = Object.keys(stats1.response[0])[i] + ": " + Object.values(stats1.response[0])[i]
currentStat2El.textContent = Object.keys(stats2.response[0])[i] + ": " + Object.values(stats2.response[0])[i]

// here is where it checks the values against each other for conditionals and color coding
if (Object.values(stats1.response[0])[i] >Object.values(stats2.response[0])[i]) {
    currentStat1El.classList.add("green")
    currentStat2El.classList.add("red")
    currentStat1El.style.fontWeight = "bold"
}
else if (Object.values(stats1.response[0])[i] < Object.values(stats2.response[0])[i]) {
    currentStat1El.classList.add("red")
    currentStat2El.classList.add("green")
    currentStat2El.style.fontWeight = "bold"
}
else if (Object.values(stats1.response[0])[i] === Object.values(stats2.response[0])[i]) {
    currentStat1El.classList.add("blue")
    currentStat2El.classList.add("blue")
    currentStat1El.style.fontWeight = "bold"
    currentStat2El.style.fontWeight = "bold"
}
statEl1.appendChild(currentStat1El)
statEl2.appendChild(currentStat2El)
}
}}

// autocomplete cities that have pro NBA/NHL teams
$( function() {
    var availableTags = [
        "Atlanta",
        "Boston",
        "Brooklyn",
        "Buffalo",
        "Calgary",
        "Charlotte",
        "Chicago",
        "Cleveland",
        "Columbus",
        "Dallas",
        "Denver",
        "Detroit",
        "Edmonton",
        "Glendale",
        "Houston",
        "Indianapolis",
        "Los Angeles",
        "Memphis",
        "Miami",
        "Milwaukee",
        "Minneapolis",
        "Montreal",
        "Nashville",
        "Newark",
        "New Orleans",
        "New York City",
        "Oklahoma City",
        "Orlando",
        "Ottawa",
        "Philadelphia",
        "Phoenix",
        "Pittsburgh",
        "Portland",
        "Raleigh",
        "Sacramento",
        "Saint Paul",
        "San Antonio",
        "San Francisco",
        "San Jose",
        "Seattle",
        "St. Louis",
        "Sunrise",
        "Tampa",
        "Toronto",
        "Uniondale",
        "Vancouver",
        "Paradise",
        "Salt Lake City",
        "Washington",
        "Winnipeg"        
    ];
    $( ".auto-complete" ).autocomplete({
      source: availableTags
    });
  } );

// test run of the function
getStats()
// getStats();