const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var dbport = 27017;
var port = 3333;
var access = false;
var mngr = false;


var validatorNum = [1234] // place holder validation for development

// client connection specifics follow...
io.on('connection', (socket) => {
    console.log('New socket connection...')
    socket.on('validate', (validator) => {
       for(let i=0; i<=validatorNum.length; i++){
           if(validator == validatorNum[i]){
                access = true;
                mngr = true;
                socket.emit('accessGrant', 'Server: login successful!');
            }
        }
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
    console.log(err);
});

// port connection follows...
server.listen(port);