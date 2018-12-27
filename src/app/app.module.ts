import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FrontHouseComponent } from './front-house/front-house.component';
import { KitchenComponent } from './kitchen/kitchen.component';

import { AuthGuardService } from './services/auth-guard.service';
import { MngrAuthGuardService } from './services/mngr-auth-guard.service';
import { ServerConnectService } from './services/server-connect.service';
import { ManagerComponent } from './manager/manager.component';

// if accessing database remotely during development...
// const config: SocketIoConfig = {url: 'http://52.15.149.88', options: {}};

const config: SocketIoConfig = {url: 'localhost:3333', options: {}};

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'frontHouse', component: FrontHouseComponent, canActivate: [AuthGuardService]},
  {path: 'kitchen', component: KitchenComponent, canActivate: [AuthGuardService]},
  {path: 'manager', component: ManagerComponent, canActivate: [MngrAuthGuardService]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    FrontHouseComponent,
    KitchenComponent,
    ManagerComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    ScrollDispatchModule
  ],
  providers: [
    ServerConnectService,
    AuthGuardService,
    MngrAuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }