import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FrontHouseComponent } from './front-house/front-house.component';
import { KitchenComponent } from './kitchen/kitchen.component';

import { AuthGuardService } from './services/auth-guard.service';
import { ServerConnectService } from './services/server-connect.service';

const config: SocketIoConfig = {url: 'http://localhost:3333', options: {}};

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  {path: 'frontHouse', component: FrontHouseComponent, canActivate: [AuthGuardService]},
  {path: 'kitchen', component: KitchenComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    FrontHouseComponent,
    KitchenComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
    
  ],
  providers: [
    ServerConnectService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }