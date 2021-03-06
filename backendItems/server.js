// Dependency imports here...
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, {'pingInterval': 2000, 'pingTimeout': 86400000});

// PostgreSQL database imports and definitions here...
var pg = require('pg'); //postgreSQL database
var format = require('pg-format');
var PGHOST = 'efficient-mtech.ce9o1t6gujej.us-east-2.rds.amazonaws.com';
var PGUSER = 'jacobbaldwin';
var PGDATABASE = 'efficient';
var PGPASSWORD = 'jjrhmjbb7';
var dbConfig = {
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
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
    var currUser = "";
    
    socket.on('validate', function(preParseData){
        
        var data = JSON.parse(preParseData).data;
        console.log(data);

        var validateNumQuery = format(`SELECT * FROM users WHERE userid = '${data}'`);
        myClient.query(validateNumQuery, function(err,result){
            if(err){console.log(err)};
            if(result.rows.length > 0){
                if(data == result.rows[0].userid){
                    access = true;
                    console.log('Access is verified');
                    currUser = data;
                    console.log(data);
                    if(result.rows[0].mngr == true){
                        mngr = true;
                        socket.emit('accessGrant', true);
                    }
                    else {
                        socket.emit('accessGrant', false);
                    }
                }
            }
            else{
                console.log('Access denied');
                socket.emit('accessDeny');
            }
        });
    });

    // methods and calls as necessary after validation follow...
    socket.on('getCurrUserName', function(){
        if(access == true){
            socket.emit('currUserNameDump', currUser);
        }
    });

    socket.on('getOpenOrders', function(preParseData){
        // communicate with DB here and then emit fetched info.
        if(access == true){
            var data = JSON.parse(preParseData);
            var getOpenOrdersQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' AND complete = false ORDER BY ordernum ASC`);
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
                                        AND day = '${data.day}' AND finalized = false ORDER BY ordernum ASC`);
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
                                        AND day = '${data.day}' AND complete = true ORDER BY ordernum ASC`);
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
                                        AND day = '${data.day}' AND ordernum = ${data.data}`);
            myClient.query(getOrderDetailsQuery, function(err,result){
                if(err){console.log(err)};
                if(result){
                    if(result.rows.length > 0){
                        var orderDetails = JSON.stringify(result.rows[0]);
                        socket.emit('orderDetailsDump', orderDetails);
                    }
                }
            });
        }
    }); 
    socket.on('getMenuItems', function(){
        if(access == true){
            var getMenuItemsQuery = format('SELECT * FROM menuitems');
            myClient.query(getMenuItemsQuery, function(err,result){
                if(err){console.log(err)};
                var menuItems = JSON.stringify(result.rows);
                socket.emit('menuItemsDump', menuItems);
            });   
        }
    });
    socket.on('getNewOrderNum', function(preParseData){
        if(access == true){
            
        }
    });
    socket.on('submitOrder', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var newNum = 0;
    
            var getUsedNumsQuery = format(`SELECT ordernum FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' ORDER BY ordernum ASC`);
            myClient.query(getUsedNumsQuery, function(err,result){
                if(err){console.log("There was an error with getting info from DB: " + err)};
                var highestNum = 0;
                for(var i=0; i<result.rows.length; i++){
                    if(result.rows[i].ordernum > highestNum){
                        highestNum = result.rows[i].ordernum;
                    }
                }
                newNum = ++highestNum;
                var submitOrderCmd = format(`INSERT INTO orderhistory (year, month, day, ordernum, items, complete, finalized) 
                                        VALUES ('${data.year}','${data.month}','${data.day}',${newNum},'${data.data}', false, false)`);
                
                myClient.query(submitOrderCmd, function(err){
                    if(err){console.log(err)};
                    console.log("Order submitted.");
                });
            });
        }
    });

    // Edit order functionality slated for future release...
    // socket.on('editOrder', function(data){
    //     
    // });

    socket.on('completeOrder', function(preParsedData){
        if(access == true){
            // sql get order and edit
            var data = JSON.parse(preParsedData);
            var completeOrderStatement = format(`UPDATE orderhistory SET complete = true WHERE ordernum='${data.data}' AND year='${data.year}'
                                        AND month='${data.month}' AND day='${data.day}'`);
            myClient.query(completeOrderStatement, function(err, result){
                if(err){console.log(err)};
                socket.emit('orderMarkedComplete');
            })
        }
    });
    socket.on('submitPayment', function(preParseData){
        if(access == true){
            var data = JSON.parse(preParseData);
            var orderPaidCmd = format(`UPDATE orderhistory SET finalized = true WHERE ordernum='${data.data}'`);
            myClient.query(orderPaidCmd, function(err,result){
                if(err){
                    console.log(err);
                } else {
                    socket.emit('finalizedConf');
                }
            });
        }
    });
    
    // Manager-only items follow...
    socket.on('getOrderHistory', function(preParseData){
        if(access == true && mngr == true){
            var data = JSON.parse(preParseData);
            var getOrderHistQuery = format(`SELECT * FROM orderhistory WHERE year = '${data.year}' AND month = '${data.month}'
                                        AND day = '${data.day}' ORDER BY ordernum ASC`);
            myClient.query(getOrderHistQuery, function(err,result){
                if(err){console.log(err)};
                socket.emit('orderHistoryDump', result.rows);
            });
        }
    });
    socket.on('addUser', function(preParseData){
        if(access == true && mngr == true){
            var data = JSON.parse(preParseData);
            var addNewUserCmd = format(`INSERT INTO users (userid, name, mngr) VALUES ('${data.data.userId}','${data.data.name}',${data.data.mngr})`);
            myClient.query(addNewUserCmd, function(err,result){
                if(err){
                    console.log(err);
                } else {
                    socket.emit('userAddComplete');
                }
            });
        }
    });
    socket.on('removeUser', function(preParseData){
        if(access == true && mngr == true){
            var data = JSON.parse(preParseData);
            var removeUserCmd = format(`DELETE FROM users WHERE userid='${data.data}'`);
            if(data.data != currUser){
                myClient.query(removeUserCmd, function(err,result){
                    if(err){
                        console.log(err);
                    } else {
                        socket.emit('userRemoveVerify');
                    }
                });
            } else {
                socket.emit('removeSelfDeny');
            }
        }
    });
    socket.on('getUsers', function(){
        if(access == true && mngr == true){
            var getUsersQuery = format('SELECT * from users');
            myClient.query(getUsersQuery, function(err,result){
                if(err){
                    console.log(err)
                } else {
                    socket.emit('currentUsersDump', result.rows);
                }
            });
        }
    });
    socket.on('userIdSubmit', function(preParseData){
        if(access == true && mngr == true){
            var data = JSON.parse(preParseData);
            var userIdQuery = format(`SELECT userid FROM users WHERE userid='${data.data.userId}'`);
            myClient.query(userIdQuery, function(err,result){
                if(err){
                    console.log(err);
                    socket.emit('userIdValidate', -1);
                } else {
                    if(result.rows.length > 0){
                        socket.emit('userIdValidate', false);
                        console.log('validation unsuccessful for id...');
                    } else {
                        var addNewUserCmd = format(`INSERT INTO users (userid, name, mngr) VALUES ('${data.data.userId}','${data.data.name}',${data.data.mngr})`);
                        myClient.query(addNewUserCmd, function(err,result){
                            if(err){
                                console.log(err);
                                socket.emit('userIdValidate', -2)
                            } else {
                                socket.emit('userIdValidate', true);
                                console.log('validation successful for id...');
                            }
                        });
                    }
                }
            });
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