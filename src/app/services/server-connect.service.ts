import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
 
@Injectable({
  providedIn: 'root'
})

export class ServerConnectService {

  validated: boolean = false;
  mngr: boolean = false;

  constructor(private socket: Socket) { 
    
  }

  // reqests located below...

  dataToServer(event, data){
    this.socket.emit(event, data);
  }
  toServer(event){
    this.socket.emit(event);
  }
}