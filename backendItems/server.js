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
    });

    var access = false;
    var mngr = false;
    var currUser = '';
    
    socket.on('validate', function(preParseData){
        var validatorNums = [1234];
        var mngrNums = [1234];

        var data = JSON.parse(preParseData);
        var validator = data.data;

        var getValidatorNumsQuery = format('SELECT userid FROM users');
        myClient.query(getValidatorNumsQuery, function(err,result){
            if (err){console.log(err)};
            console.log(result.rows);
            validatorNums = [];
            for (var i=0; i<result.rows.length; i++){
                validatorNums.push(result.rows[i].userid);
            }
            console.log(validatorNums);
        });
        var getMngrNumsQuery = format('SELECT userid FROM users WHERE mngr = true');
        myClient.query(getMngrNumsQuery, function(err,result){
            if (err){console.log(err)};
            console.log(result.rows);
            mngrNums = [];
            for (var i=0; i<result.rows.length; i++){
                mngrNums.push(result.rows[i].userid);
            }
            console.log(mngrNums);
        });
        for(var i=0; i<validatorNums.length; i++){
            if(validator == validatorNums[i]){
                access = true;
                // console.log('access set to true');
                var getUserNameQuery = format(`SELECT name FROM users WHERE userid = '${validator}'`);
                myClient.query(getUserNameQuery, function(err,result){
                    console.log(result.rows);
                    currUser = result.rows[0].name;
                    console.log('Currently logged in as: ' + currUser);
                });
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
    });

    // methods and calls as necessary after validation follow...
    socket.on('getCurrUserName', function(){
        socket.emit('currUserNameDump', currUser);
    });

    socket.on('getOpenOrders', function(preParseData){
        // communicate with DB here and then emit fetched info.
        if(access == true){
            var data = JSON.parse(preParseData);
            var getOpenOrdersQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' AND complete = false`);
            myClient.query(getOpenOrdersQuery, function(err,result){
                if(err){console.log(err)};
                // console.log(result.rows);
                var openOrderNums = [];
                for(var i=0; i<result.rows.length; i++){
                    openOrderNums.push(result.rows[i].ordernum);
                }
                socket.emit('openOrdersDump', openOrderNums);
            });
        }
    });
    socket.on('getUnpaidOrders', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var getUnpaidOrdersQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' AND finalized = false`);
            myClient.query(getUnpaidOrdersQuery, function(err,result){
                if(err){console.log(err)};
                // console.log(result.rows);
                var unpaidOrderNums = [];
                for(var i=0; i<result.rows.length; i++){
                    unpaidOrderNums.push(result.rows[i].ordernum);
                }
                socket.emit('unpaidOrdersDump', unpaidOrderNums);
            });
        }
    });
    socket.on('getCompleteOrders', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var getCompleteOrdersQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' AND complete = true`);
            myClient.query(getCompleteOrdersQuery, function(err,result){
                if(err){console.log(err)};
                var completeOrderNums = [];
                for(var i=0; i<result.rows.length; i++){
                    completeOrderNums.push(result.rows[i].ordernum);
                }
                socket.emit('completeOrdersDump', completeOrderNums);
            });
        }
    });
    socket.on('getOrderDetails', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var getOrderDetailsQuery = format(`SELECT * FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' AND ordernum = '${data.data}'`);
            myClient.query(getOrderDetailsQuery, function(err,result){
                if(err){console.log(err)};
                var orderDetails = JSON.stringify(result.rows[0]);
                socket.emit('orderDetailsDump', orderDetails);
            });
        }
    }); 
    socket.on('getMenuItems', function(){
        if(access == true){
            var getMenuItemsQuery = format('SELECT * FROM menuitems');
            var menuItems;
            myClient.query(getMenuItemsQuery, function(err,result){
                if(err){console.log(err)};
                console.log(result.rows);
                menuItems = result.rows;
                socket.emit('menuItemsDump', menuItems);
            });   
        }
    });
    socket.on('getNewOrderNum', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var getUsedNumsQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}'`);
            var newNum;
            myClient.query(getUsedNumsQuery, function(err,result){
                if(err){console.log(err)};
                console.log(result.rows);
                var highestNum = 0;
                for(var i=0; i<result.rows.length; i++){
                    if(Number(result.rows[i].ordernum) > highestNum){
                        highestNum = Number(result.rows[i].orderNum);
                    }
                }
                newNum = highestNum++;
                socket.emit('newOrderNumDump', newNum);
            });
        }
    });
    socket.on('submitOrder', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var submitOrderQuery = format(`INSERT INTO orderhistory (year, month, day, ordernum, items, complete, finalized) 
                                        VALUES ('${data.year}','${data.month}','${data.day}','${data.orderNum}','${data.items}', false, false)`);
        }
    });
    socket.on('editOrder', function(data){
        if(access == true){
            // sql get order and edit
        }
    });
    socket.on('completeOrder', function(data){
        if(access == true){
            // sql get order and edit
        }
    });
    socket.on('submitPayment', function(dataArray){
        if(access == true){

        }
    });
    socket.on('finalizeOrder', function(date, orderNum){
        if(access == true){
            // sql get order and edit
        }
    });
    // Manager-only items follow...
    socket.on('getOrderHistory', function(preParseData){
        if(access == true && mngr == true){
            var data = JSON.parse(preParseData);
            var getOrderHistQuery = format(`SELECT * FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}'`);
            myClient.query(getOrderHistQuery, function(err,result){
                if(err){console.log(err)};
                console.log(result.rows);
                socket.emit('orderHistoryDump', result.rows);
            });
        }
    });
    socket.on('addUser', function(data){
        if(access == true && mngr == true){
            // using attached object, will create new user in database.
        }
    });
    
    socket.on('disconnect', function(){
        console.log('Connection with socket has ended');
    });
});

// error specifications follow...
io.on('error', function(err){
    console.log('The following connection error occurred:');
    console.log(err);
});

// port connection follows...
server.listen(port);
console.log(`Server running on localhost:${port}`);