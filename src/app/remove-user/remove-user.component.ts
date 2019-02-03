import { Component, OnInit } from '@angular/core';
import { ServerConnectService } from '../services/server-connect.service';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-remove-user',
  templateUrl: './remove-user.component.html',
  styleUrls: ['./remove-user.component.less']
})
export class RemoveUserComponent implements OnInit {

  constructor(private serverConnect: ServerConnectService, private router: Router, private socket: Socket) { 

    // Listeners and initial component-build commands follow...
    this.serverConnect.toServer('getUsers', -1);
    this.socket.on('currentUsersDump', (data)=>{
      console.log('current user dump sent by server');
      this.currentUsers = data;
    });
    this.socket.on('removeSelfDeny', ()=>{
      alert("You cannot delete the account currently logged in to.");
    });
  }

  ngOnInit() {
  }

  // Component attributes follow...
  currentUsers: any[] = [];
  selectedUserNum: string;

  // Function called when a specific user's information is clicked on...
  selectUser(user){
    if(document.getElementById(this.selectedUserNum)){
      document.getElementById(this.selectedUserNum).classList.remove('highlight');
    }
    this.selectedUserNum = user;
    document.getElementById(user).classList.add('highlight');
  }

  // Function called when Remove User button is clicked...
  removeUser(){
    this.serverConnect.toServer('removeUser', this.selectedUserNum);
    this.socket.on('userRemoveVerify', ()=>{
      console.log('User successfully removed from the system.');
      this.serverConnect.toServer('getUsers', -1);
      // DOM action here
    });
  }
}
