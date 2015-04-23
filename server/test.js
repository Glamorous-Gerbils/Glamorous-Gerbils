/*

1. Open the mysql server
2. Copy each block from here
3. Paste each block into the terminal
4. Rejoice in a full database!

*/



// add three restaurants to the table
INSERT INTO restaurants (google_id, name, longitude, latitude, website) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs","Jimmy John's",-97.742526,30.27072,"https://www.jimmyjohns.com/menu/#/");
INSERT INTO restaurants (google_id, name, longitude, latitude, website) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY","Subway",-97.741557,30.270183,"http://www.subway.com/subwayroot/careers/");
INSERT INTO restaurants (google_id, name, longitude, latitude, website) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0","Austin Club",-97.74091900000002,30.270743,"http://www.austinclub.com/");

// add wait times to Jimmy John's
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",45);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",20);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",35);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJoQKzBAq1RIYR9vDjI9c6QZs",25);

// add wait times to Subway
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",45);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",20);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",35);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-yElAAq1RIYRiJYnsvPyhUY",25);

// add wait times to Austin Club
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",45);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",20);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",35);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",15);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",30);
INSERT INTO reports (google_id,wait_time) VALUES ("ChIJ-b18sKC1RIYRiDl8W83nAW0",25);