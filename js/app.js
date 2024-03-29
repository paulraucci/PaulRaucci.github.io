let teamObject = {};
let scheduleObject = {};
let allTeams = [];
let teamSchedule = [];
$(() => {
  const handleData = apiData => {
    const nba = apiData.data;
    for (let i = 0; i < nba.length; i++) {
      // console.log(nba[i]);
      teamObject = {
        teamId: nba[i].id,
        city: nba[i].city,
        fullName: nba[i].full_name
      };
      allTeams.push(teamObject);
    }
  };
  const handleTeam = teamData => {
    for (let i = 0; i < allTeams.length; i++) {
      const $team = $("<button>")
        .attr("id", `${allTeams[i].teamId}`)
        .text(`${allTeams[i].fullName}`)
        .addClass("teamName");
      $(".buttonField").append($team);
    }
    //
    const $reset = $("<button>")
      .attr("id", "resetButton")
      .text("Choose another team");
    $("#schedule").append($reset);
    $("#resetButton").on("click", event => {
      event.currentTarget.reset;
      $reset = location.reload(true);
    });

    //
    $(".teamName").on("click", event => {
      event.currentTarget.fullName;
      const teamName = $(".selectTeam");
      const selectTeam = teamName.val();
      const teamData = allTeams;
      //
      // console.log(event.currentTarget.id);

      $.ajax(
        // changed event.currentTarget.fullname to id
        `https://www.balldontlie.io/api/v1/games?seasons[]=2019&&team_ids[]=${event.currentTarget.id}`
      ).then(dates => {
        for (let i = 0; i < dates.data.length; i++) {
          scheduleObject = {
            gameDate: dates.data[i].date,
            homeTeam: dates.data[i].home_team.name,
            visitorTeam: dates.data[i].visitor_team.name,
            gameTime: dates.data[i].status
          };

          const gameDate = `${scheduleObject.gameDate}`;

          const newDate = new Date(gameDate);
          //
          teamSchedule.push(scheduleObject);
          //
          // console.log(gameDate);
          //
          const schedule = $("<li>").text(
            `The ${scheduleObject.homeTeam} are playing the ${
              scheduleObject.visitorTeam
            } on ${newDate.toDateString()} at ${scheduleObject.gameTime}`
          );

          schedule.attr("class", "teamSchedule");
          $(".viewSchedule").append(schedule);
        }

        // console.log(teamSchedule);
        // console.log(dates.data);
      });
    });
  };
  $.ajax(`https://www.balldontlie.io/api/v1/teams`)
    .then(handleData)
    .then(handleTeam);
});
//
//
//
//
// =============MAP===========================
//
//
let map, infoWindow;
// infoWindow ==shows where the user is with pop-up
// =====\/=======\/ initializes map
function initMap() {
  let options = {
    center: { lat: 41.043042, lng: -73.53257 },
    zoom: 15,
    type: ["gym", "park"],
    radius: 1000
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  //

  infoWindow = new google.maps.InfoWindow();
  //
  // =====\/\/========\/\/ geolocates on users location by using the IP address and displays a you are here message at users location, if not centers map on provided coordinates upon map initialization.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(p) {
      let position = {
        lat: p.coords.latitude,
        lng: p.coords.longitude
      };
      infoWindow.setPosition(position);
      infoWindow.setContent("You are here");
      infoWindow.open(map);
    });
  } else {
    handleLocationError("No geolocation", map.center());
  }
  // populates map with pins of found locations for what the user is searching for
  function handleLocationError(content, position) {
    infoWindow.setPosition(position);
    infoWindow.setContent(content);
    infoWindow.open(map);
  }
  let input = document.getElementById("search");
  let searchBox = new google.maps.places.SearchBox(input);

  map.addListener("bounds_changed", function() {
    searchBox.setBounds(map.getBounds());
  });
  // array is filled with objects with locations as a pin for each search entered
  let markers = [];

  searchBox.addListener("places_changed", function() {
    let places = searchBox.getPlaces();
    if (places.length === 0) return;

    markers.forEach(function(m) {
      m.setMap(null);
    });
    markers = [];

    let bounds = new google.maps.LatLngBounds();
    places.forEach(function(p) {
      if (!p.geometry) return;

      markers.push(
        new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location
        })
      );
      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      else bounds.extend(p.geometry.location);
    });
    map.fitBounds(bounds);
  });
}
//
//
