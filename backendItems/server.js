const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

var dbport = 27017;
// default MongoDB port.
var port = 3333;
// port for DB connection in backend.
var validatorNums = [1234, 5678]; // place holder validation for development
var mngrNums = [1234];

// query DB here and assign validatorNums values.

// client connection specifics follow...
io.on('connection', (socket) => {
    console.log('New socket connection...');

    var access = false;
    var mngr = false;
    
    socket.on('validate', (validator) => {
        for(let i=0; i<validatorNums.length; i++){
            if(validator == validatorNums[i]){
                access = true;
                // console.log('access set to true');
            };
        };
        for(let i=0; i<mngrNums.length; i++){
            if(mngrNums[i] == validator){
                mngr = true;
                // console.log('mngr set to true');
            };
        };
        if(access == true){
            if(mngr == true){
                socket.emit("accessGrant", true);
            } 
            if(mngr == false){
                socket.emit("accessGrant", false);
            }
        };
        if(access == false){
            socket.emit("accessDeny");
        };
    });

    // methods and calls as necessary after validation occur here.
    socket.on('getOrderHistory', ()=>{

    });
    socket.on('getOpenOrders', ()=>{
        // communicate with DB here and then emit fetched info.
        if(access == true){
            socket.emit('openOrdersDump', [1,2,3,4,5,6,7,8,9,10,13,15,17]);
        }
    });
    socket.on('getOrderDetails', (orderNum)=>{
        // query order from DB and emit order details as JSON *STRING. Will
        // be parsed on the front end.
        // place-holder data for development by defualt...
        let data = `{
            items: [{
                name: 'Cheeseburger',
                price: 7.99,
                build: [],
                notes: 'No Tomatoes'
            },{
                name: 'Medium Drink',
                price: 1.99,
                build: [],
                notes: 'Coca-Cola'
            }],
            enteredTime: '14:35:25',
            complete: false,
            finalized: false
        }`;
        socket.emit('orderDetailsDump', data);
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
    
    socket.on('addUser', (data)=>{
        // using attached object, will create new user in database.
    });
    

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
console.log(`Server running on localhost:${port}`);