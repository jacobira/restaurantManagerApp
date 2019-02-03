import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private socket: Socket, private router: Router) {

    // Listeners and initial component-build commands follow...
    this.socket.on("accessGrant", (mngr)=>{
      this.serverConnect.validated = true;
      if(mngr == true){
        this.serverConnect.mngr = true;
      };
      this.serverConnect.toServer('getCurrUserName');
      this.socket.on('currUserNameDump', (user)=>{
        this.serverConnect.currUser = user;
        this.router.navigate(["/", "home"]);
      });
    });
    this.socket.on("accessDeny", ()=>{
      console.log("Incorrect login information.");
      document.getElementById("incorrect").classList.remove("hidden");
      document.getElementById("inputBox").classList.add("outline");
    });
  }

  ngOnInit() {
  }

  // Function called when 'Enter' button clicked on...
  submitIdInput(id){
    this.serverConnect.toServer("validate", id);
  }
}
