// Dependency imports here...
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {'pingInterval': 2000, 'pingTimeout': 86400000});

// PostgreSQL database imports here...
var pg = require('pg'); //postgreSQL database
var format = require('pg-format');
var PGUSER = 'jacobbaldwin'; // ****change to power_user for deployment****
var PGDATABASE = 'efficient-test'; // ****change to efficient for deployment****
var dbConfig = {
    user: PGUSER,
    database: PGDATABASE,
    max: 10,
    idleTimeoutMillis: 30000
};
var pool = new pg.Pool(dbConfig);
var myClient;

// server's assigned port...
var port = 3333;

// server-client socket connection specifics follow...
io.on('connection', function(socket){
    console.log('New socket connection...');

    pool.connect(function(err, client, done){
        if(err){console.log(err)};
        myClient = client;
    })

    var access = false;
    var mngr = false;
    
    socket.on('validate', function(validator){
        var validatorNums = [1234];
        var mngrNums = [1234];

        var getValidatorNumsQuery = format('SELECT userid FROM users');
        myClient.query(getValidatorNumsQuery, function(err,result){
            if (err){console.log(err)};
            console.log(result.rows);
            validatorNums = [];
            for (var i=0; i<result.rows.length; i++){
                validatorNums.push(result.rows[i].userid);
            }
            console.log(validatorNums);
        })

        var getMngrNumsQuery = format('SELECT userid FROM users WHERE mngr = true');
        myClient.query(getMngrNumsQuery, function(err,result){
            if (err){console.log(err)};
            console.log(result.rows);
            mngrNums = [];
            for (var i=0; i<result.rows.length; i++){
                mngrNums.push(result.rows[i].userid);
            }
            console.log(mngrNums);
        })

        for(var i=0; i<validatorNums.length; i++){
            if(validator == validatorNums[i]){
                access = true;
                // console.log('access set to true');
            }
        }
        for(var i=0; i<mngrNums.length; i++){
            if(mngrNums[i] == validator){
                mngr = true;
                // console.log('mngr set to true');
            }
        }
        if(access == true){
            if(mngr == true){
                socket.emit("accessGrant", true);
            } 
            if(mngr == false){
                socket.emit("accessGrant", false);
            }
        }
        if(access == false){
            socket.emit("accessDeny");
        }
    })

    // methods and calls as necessary after validation follow...

    socket.on('getOpenOrders', function(year, month, day){
        // communicate with DB here and then emit fetched info.
        if(access == true){
            var getOpenOrdersQuery = format(`SELECT ordernum FROM orderhistory WHERE year = ${year} AND month = ${month} AND day = ${day} AND complete = false`);
            myClient.query(getOpenOrdersQuery, function(err,result){
                if(err){console.log(err)};
                console.log(result.rows);
                var openOrderNums = [];
                for(var i=0; i<result.rows.length; i++){
                    openOrderNums.push(result.rows[i].ordernum);
                }
                socket.emit('openOrdersDump', openOrderNums);
            })
        }
    })
    socket.on('getOrderDetails', function(orderNum, year, month, day){
        var getOrderDetailsQuery = format(`SELECT * FROM orderhistory WHERE year = ${year} AND month = ${month} AND day = ${day} AND orderNum = ${orderNum}`);
        myClient.query(getOrderDetailsQuery, function(err,result){
            if(err){console.log(err)};
            console.log(result.rows);
            var orderDetails = result.rows[0];
        })
        socket.emit('orderDetailsDump', orderDetails);
    })
    socket.on('getMenuItems', function(){
        var getMenuItemsQuery = format('SELECT * FROM menuitems');
        myClient.query(getMenuItemsQuery, function(err,result){
            if(err){console.log(err)};
            console.log(result.rows);
            var menuItems = result.rows;
        })
        socket.emit('menuItemsDump', menuItems);
    })
    socket.on('submitOrder', function(orderData){
        
    })
    socket.on('editOrder', function(date, orderNum){

    })
    socket.on('submitPayment', function(dataArray){

    })
    socket.on('finalizeOrder', function(date, orderNum){

    })
    // Manager-only items follow...
    socket.on('getOrderHistory', function(year, month, day){
        if(access == true){
            var getOrderHistQuery = format(`SELECT * FROM orderhistory WHERE year = ${year} AND month = ${month} AND day = ${day}`);
            myClient.query(getOrderHistQuery, function(err,result){
                if(err){console.log(err)};
                console.log(result.rows);
                socket.emit('orderHistoryDump', result.rows);
            })
        }
    })
    socket.on('addUser', function(data){
        // using attached object, will create new user in database.
    })
    
    

    socket.on('disconnect', function(){
        console.log('Connection with socket has ended');
    })
})

// error specifications follow...
io.on('error', function(err){
    console.log('The following connection error occurred:');
    console.log(err);
})

// port connection follows...
server.listen(port);
console.log(`Server running on localhost:${port}`);