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

  constructor(private serverConnect: ServerConnectService, private socket: Socket, private router: Router) { }

  ngOnInit() {
  }

  submitIdInput(id){
    this.serverConnect.dataToServer("validate", id);
    this.socket.on("accessGrant", (mngr)=>{
      console.log("Log in successful!");
      this.serverConnect.validated = true;
      if(mngr == true){
        this.serverConnect.mngr = true;
      };
      this.router.navigate(["/", "home"]);
    });
    this.socket.on("accessDeny", ()=>{
      console.log("Incorrect login information.");
    });
  }
}
