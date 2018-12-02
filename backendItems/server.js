const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var dbport = 27017;
var port = 3333;
var validatorNums = [1234, 5678]; // place holder validation for development
var mngrNums = [1234];

// client connection specifics follow...
io.on('connection', (socket) => {
    console.log('New socket connection...');

    var access = false;
    var mngr = false;
    
    socket.on('validate', (validator) => {
        for(let i=0; i<validatorNums.length; i++){
            if(validator == validatorNums[i]){
                access = true;
                console.log('access set to true');
            };
        };
        for(let i=0; i<mngrNums.length; i++){
            if(mngrNums[i] == validator){
                mngr = true;
                console.log('mngr set to true');
            };
        };
        if(access == true){
            if(mngr == true){
                socket.emit("accessGrant", true);
                console.log('mngr true firing');
            } 
            if(mngr == false){
                socket.emit("accessGrant", false);
                console.log('mngr true firing');
            }
        };
        if(access == false){
            socket.emit("accessDeny");
        };
    });

    //methods and calls as necessary after validation occur here.
    if(access == true){
        socket.on('getOrderHistory', ()=>{

        });
        socket.on('getMenuItems', ()=>{

        });
        socket.on('submitOrder', (orderData)=>{

        });
        socket.on('editOrder', (date, orderNum)=>{

        });
        socket.on('submitPayment', (dataArray)=>{

        });
        socket.on('finalizeOrder', (date, orderNum)=>{

        });

        if(mngr == true){
            socket.on('addUser', (data)=>{
                // using attached object, will create new user in database.
            })
        }
    };

    socket.on('disconnect', () => {
        console.log('Connection with socket has ended');
    });
});

// error specifications follow...
io.on('error', (err) => {
    console.log('The following connection error occurred:');
    console.log(err);
});

// port connection follows...
server.listen(port);