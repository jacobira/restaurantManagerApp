import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket, private router: Router) { }

  ngOnInit() {
  }

  // Component attributes follow...
  nameInputValue: string = '';
  userIdInputValue: string = '';
  mngrAuthValue: boolean = false;

  // Function called on submission of overall form to verify availability of userid and creation of new user in backend...
  userIdCheck(){
    this.serverConnect.toServer("userIdSubmit", {"name": this.nameInputValue,"userId": this.userIdInputValue,"mngr": this.mngrAuthValue});
    this.socket.on("userIdValidate", (data)=>{
      if(data == true){
        document.getElementById('errorBox').classList.add("hidden");
        this.router.navigate(["/","manager"]);
      }
      if(data == false){
        document.getElementById('errorBox').classList.remove("hidden");
      }
      if(data == -1){
        document.getElementById('errorBox').classList.remove("hidden");
        console.log("The server has experienced an error while attempting to verify user id availability.");
      }
      if(data == -2){
        document.getElementById('errorBox').classList.remove("hidden");
        console.log("The server has experienced an error while attempting to add new user info.")
      }
    })
  }
}
