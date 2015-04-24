var faker = require('faker');
var fs = require('fs');

var data = ["30.269329,-97.742658,ChIJl_CT7Qm1RIYRmiQYoWVnXp8,Cozzoli's Pizza,http://www.cozzolispizza.net/","30.27072,-97.742526,ChIJoQKzBAq1RIYR9vDjI9c6QZs,Jimmy John's,http://www.jimmyjohns.com/","30.27,-97.74174600000003,ChIJf9x0-Qm1RIYRR9RPGWhe9Tg,Chipotle Mexican Grill,http://www.chipotle.com/","30.269557,-97.74351200000001,ChIJz7o2jgm1RIYRi_5Y7JfjH0A,Perry's Steakhouse & Grille,http://www.perryssteakhouse.com/menu-locations/austin/downtown/","30.270183,-97.741557,ChIJ-yElAAq1RIYRiJYnsvPyhUY,Subway,http://www.subway.com/subwayroot/default.aspx?rdr=Banners:GooglePlaces:SubwayCom","30.269059,-97.74213199999997,ChIJ1XlZ4Qm1RIYR4rpevy6Ybs4,Roaring Fork,http://roaringfork.com","30.26882,-97.74228900000003,ChIJ34ezcAi1RIYRqGgNoPE6p4I,Kebabalicious,http://www.kebabalicious.com/","30.26877,-97.74277699999999,ChIJ0YsSvwm1RIYR7No0oJyKROg,Murphy's Deli,http://www.murphysdeli.com/","30.271327,-97.74195099999997,ChIJBZ8SDAq1RIYRr_FM1PoH68A,Quattro Gatti Ristorante e Pizzeria,http://www.quattrogattiaustin.com/","30.268867,-97.74135999999999,ChIJvxSpYKe1RIYR1IqtnKSlW68,Slake Cafe,http://www.slakecafe.com/","30.268397,-97.74303099999997,ChIJ0YsSvwm1RIYRN6TKC9_caXo,Athenian Bar & Grill,http://www.athenianbargrill.com/","30.270743,-97.74091900000002,ChIJ-b18sKC1RIYRiDl8W83nAW0,Austin Club,http://www.austinclub.com/","30.268192,-97.74235699999997,ChIJE2vE2gm1RIYR6NeWr_k0Oxs,Due Forni Pizza & Wine,http://dueforni.com/main/index.html","30.271748,-97.741802,ChIJc6YXdQq1RIYRb1fyQ23g2AQ,Quiznos Sandwich Restaurants,http://www.quiznos.com/restaurants/TX/Austin","30.268033,-97.74194599999998,ChIJ4yWPfKe1RIYRaY1w7rNsFIc,1886 Cafe & Bakery,http://www.1886cafeandbakery.com/","30.268038,-97.743493,ChIJWQDHxwm1RIYRJmu_M83GQlI,Ruth's Chris Steak House,http://www.ruthschris.com/restaurant-locations/austin","30.267723,-97.742618,ChIJ6YfXzQm1RIYR6TXPOW5Y14g,Jimmy John's,http://www.jimmyjohns.com/","30.267708,-97.742681,ChIJ6YfXzQm1RIYRVK9wjpy7k1k,Brian's Brew Coffee,http://www.briansbrew.com/","30.268908,-97.74025,ChIJZbZ4P6e1RIYRGZA9TPsBOFQ,Ancho's Restaurant,http://www.omnihotels.com/FindAHotel/AustinDowntown/Dining.aspx","30.267722,-97.74112300000002,ChIJ12V_eae1RIYRGojadRISJg4,B.D. Riley's Irish Pub & Restaurant,http://bdrileys.com/"]
var restaurants = [];
for ( var i = 0; i < data.length; i++ ) {
  restaurants.push(data[i].split(','));
}


// for all twenty restaurants, generate SQL queries for the database

var restaurantQueries = [];
var reportQueries = [];

for ( var j = 0; j < 20; j++ ) {
  // get current restaurant in array, every five elements. create SQL insert statements for them
  var resInfo = restaurants[j];
  var resQuery = "INSERT INTO restaurants (google_id, name, website, longitude, latitude) VALUES ('" + resInfo[2] + "', '" + resInfo[3] + "', '" + resInfo[4] + "', '" + resInfo[1] + "', '" + resInfo[0] + "');";
  restaurantQueries.push(resQuery);

  // generate ten reports for every hour, for five days, for each restaurant
  // open hours are hardcoded to 12, currently, but a future improvement could be to calculate it based on open/close times

  // hard-coded trends
  var lunchpeak = [[0, 10], [10, 15], [20, 30], [20, 30], [30, 40], [20, 30], [10, 20], [0, 10], [0, 10], [10, 15], [10, 15], [0, 10]];
  var breakfastpeak = [[10, 20], [20, 35], [30, 40], [30, 40], [20, 30], [10, 20], [0, 10], [0, 10], [0, 10], [10, 15], [10, 15], [0, 10]];
  var dinnerpeak = [[0, 10], [0, 10], [10, 15], [0, 10], [10, 15], [10, 15], [0, 10], [10, 15], [15, 20], [20, 25], [20, 25], [20, 25]];
  var trends = [lunchpeak, breakfastpeak, dinnerpeak];
  var date = '04-10-15';

  for ( var day = 5; day > 0; day-- ) {
    var trend = trends[Math.floor(Math.random() * trends.length)];
    var startTime = '08:00:00';
    var endTime = '08:59:00';

    for ( var hour = 12; hour > 0; hour--) {

      for ( var report = 10; report > 0; report--) {
        var timestamp = faker.date.between(date + ' ' + startTime, date + ' ' + endTime);
        var formattedStamp = timestamp.toISOString().replace('T', ' ').slice(0, 19);
        
        var waitRange = trend[hour - 1];
        var waitTime = Math.floor(Math.random()*(waitRange[1]-waitRange[0] + 1) + waitRange[0]);

        var reportQuery = "INSERT INTO reports (google_id, wait_time, created_at) VALUES ('" + resInfo[2] + "', '" + waitTime + "', '" + formattedStamp + "');";
        reportQueries.push(reportQuery);
      }
      startTime = (Number(startTime.slice(0, 2)) + 1) + ':00:00';
      if ( startTime.length !== 8 ) startTime = '0' + startTime;
      endTime =  (Number(endTime.slice(0, 2)) + 1) + ':59:00';
      if ( endTime.length !== 8 ) endTime = '0' + endTime;
    }
    date = '04-' + (Number(date.slice(3, 5)) + 1) + '-15';
  }
}

/*
fs.writeFile('restaurants.txt', restaurantQueries.join('\n'), function (err) {
  if ( err ) throw err;
  console.log('Successfully saved restaurantQueries to restaurants.txt!');
});
*/

fs.writeFile('reports.txt', reportQueries.join('\n'), function (err) {
  if ( err ) throw err;
  console.log('Successfully saved reportQueries to reports.txt!');
});

// sanitize all restaurant names with:
// $location = mysql_real_escape_string($location);

// final query for restaurants should look like:
// $name = mysql_real_escape_string("Cozzoli's Pizza"); --> this is a PHP function. If I ask everyone to copy and paste in shell,
// I have to pre-sanitize the names, replacing every apostrophe with two single ones like this: 'Cozzoli''s Pizza'
// INSERT INTO restaurants (google_id, name, website, longitude, latitude) VALUES ('ChIJl_CT7Qm1RIYRmiQYoWVnXp8', $name, 'http://www.cozzolispizza.net/', 30.269329, -97.742658);

// final query for reports should look like:
// INSERT INTO reports (google_id, wait_time, created_at) VALUES ('ChIJ-b18sKC1RIYRiDl8W83nAW0', 20, '2016-05-21 18:31:12');