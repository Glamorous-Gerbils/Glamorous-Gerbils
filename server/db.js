/* db.js */

var mysql = require('mysql');

var pool = mysql.createPool({
  host     : process.env.DB_URL || 'localhost',
  user     : process.env.DB_USER || 'root',
  password : process.env.DB_PWD || '',
  database : process.env.DB || 'nomnow'
})

exports.init = function(){
  var createDB = 'CREATE DATABASE IF NOT EXISTS nomnow;';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });
    if(!err){
      connection.query(createDB,function(err,results){
    
      });    
    }
    connection.release();
  });
  
  var useQuery = 'USE nomnow;'; 
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(useQuery,function(err,results){

      });
    }
    connection.release();
  });

  var createTblRestaurants = "CREATE TABLE IF NOT EXISTS restaurants (google_id varchar(255) NOT NULL,name varchar(255) NOT NULL, website varchar(255) NOT NULL DEFAULT 'undefined', longitude double precision NOT NULL,latitude double precision NOT NULL,PRIMARY KEY(google_id));";
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
        connection.query(createTblRestaurants,function(err,results){

      });    
    }
    connection.release();    
  });
  

//  });
  var createTblReports = 'CREATE TABLE IF NOT EXISTS reports (id int NOT NULL auto_increment,google_id varchar(255) NOT NULL,wait_time int NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(id),FOREIGN KEY(google_id) REFERENCES restaurants(google_id));';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(createTblReports,function(err,results){

      });      
    }    
    connection.release();
  });

};

exports.getLatestAvgWaitAtLocation = function(locationID, cb){
  avgWaitQuery = 'SELECT ROUND(AVG(reports.wait_time)/5,0)*5 FROM reports WHERE google_id=?;';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(avgWaitQuery,[locationID],function(err,results){
        if(err){
          console.log(err);
        }else if(results){
            var avgWait = getAvgWait(results[0]);
            cb(avgWait, locationID);
        }
        connection.release();
      });      
    }
  });
};

exports.getAvgWaitsLatestReportAllLocs = function(cb){
  var complicatedQuery = 'SELECT restaurants.google_id, restaurants.name, restaurants.website, restaurants.longitude, restaurants.latitude, ROUND(AVG(reports.wait_time)/5,0)*5 AS avg_wait, (SELECT reports.created_at FROM reports WHERE reports.google_id = restaurants.google_id ORDER BY reports.created_at DESC LIMIT 1) AS most_recent FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id GROUP BY restaurants.google_id;';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(complicatedQuery,function(err,results){
        if(err){
          console.log('ERROR : ',err);
        }else if(results){
          cb(results);
        }
      });      
    }
    connection.release();
  });
};

exports.getAllRestaurants = function(cb){
  var getAllQuery = 'SELECT restaurants.google_id, restaurants.name, restaurants.website, reports.wait_time, reports.created_at FROM restaurants INNER JOIN reports ON restaurants.google_id = reports.google_id;';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(getAllQuery,function(err,results){
        if(!err){
          cb(results);
        }
      });      
    }
    connection.release();
  });
};

exports.isRestaurantInDB = function(locationID){
  var existsQuery = 'SELECT EXISTS(SELECT * FROM restaurants WHERE google_id=?);';
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(existsQuery,function(err,results){
        if(!err){
          for(var k in results[0]){
            return results[0][k];
          }
        }
      });
      connection.release();
    }
  });
};

exports.addReport = function(locationID,waitTime,name,website,lon,lat){
  var reportQuery = 'INSERT INTO reports (google_id, wait_time) VALUES (?,?);';
  var params = [locationID,waitTime];
  if(exports.isRestaurantInDB(locationID)){
    // NO OP
  }else{
    exports.addRestaurant(name,website,locationID,lon,lat);
  }
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(reportQuery,params,function(err,results){

      });
      connection.release();      
    }
  });
};

exports.addRestaurant = function(name,website,g_id,lon,lat){
  // ignore duplicates or error
  var addQuery = 'INSERT IGNORE INTO restaurants (name,website,google_id,longitude,latitude) VALUES (?,?,?,?,?);';
  var params = [name,website,g_id,lon,lat];
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(addQuery,params,function(err,results){

      });
      connection.release();      
    }
  });
};

exports.getLatestReportTimestampById = function(g_id,cb){
  var getLatestQuery = 'SELECT created_at FROM reports WHERE google_id=? AND created_at = (SELECT MAX(created_at) FROM reports) LIMIT 1';
  var params = g_id;
  pool.getConnection(function(err,connection){
    connection.on('error', function(err) {
      console.log(err.code); 
    });    
    if(!err){
      connection.query(getLatestQuery,params,function(err,results){
        if(!err){
          cb(results);
        }
      });
      connection.release();      
    }
  });
};

exports.addCalledReport = function(phoneNumber,time) {
  var getID = 'SELECT google_id FROM restaurants WHERE phone=?';
  var params = phoneNumber;
  pool.getConnection(function(err, connection){
    connection.on('error', function(err) {
      console.log(err.code);
    });
    if(!err){
      connection.query(getID,params,function(err,results) {
        if(!err){
          //do something with results
          console.log(results)
          var ID = results[0].google_id;
          exports.addReport(ID,time);
        }
      });
      connection.release();
    }
  });
};

exports.init();
