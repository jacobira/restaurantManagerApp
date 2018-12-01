import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ServerConnectService {

  validated: boolean = false;

  constructor(private socket: Socket, private router: Router) { 
    // tests below...
    // this.validate(1234);
  }

  // reqests located below...

  validate(id: number){
    this.socket.emit('validate', id);
    this.socket.on('accessGrant', (data)=>{
      console.log(`${data}`);
      this.validated = true;
      this.router.navigate(['/','home']);
    });
  };

  getOrderHistory(){
    this.socket.emit('getOrderHistory'); // may possibly need parameters
    this.socket.on('returnOrderHistory', (data)=>{
      // parse and distribute data for order history here
    });
  };

  getMenuItems(){
    this.socket.emit('getMenuItems');
    this.socket.on('returnMenuItems', (data)=>{
      // parse and distribute data for menu items here
    });
  }

  submitOrder(orderData){
    this.socket.emit('submitOrder', orderData);
    this.socket.on('verifySubmit', (data)=>{
      console.log(data);
      // parse and distribute data from order submission response here
    });
  }

  editOrder(date, orderNum){
    this.socket.emit('editOrder', [date, orderNum]);
    this.socket.on('editOrderComplete', (data)=>{
      console.log(data);
      // parse and distribute data from order edit confirmations here
    });
  }

  submitPayment(date, orderNum, amt, method){
    this.socket.emit('payment', [date, orderNum, amt, method]);
    this.socket.on('paymentConfirm', (data)=>{
      console.log(data);
      // parse and distribute data from payment confirmations here
    })
  }

  finalizeOrder(date, orderNum){
    this.socket.emit('finalizeOrder', [date, orderNum]);
    this.socket.on('finalizeOrderComplete', (data)=>{
      console.log(data);
      // parse and distribute data from order finalization confirmations here
    });
  }
}