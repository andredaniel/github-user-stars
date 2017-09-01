import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

// materialize
import { MaterializeModule } from "angular2-materialize";

// components
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CardRepositoryComponent } from './shared/card-repository/card-repository.component';
import { UserInfoComponent } from './shared/user-info/user-info.component';
import { StarGazersComponent } from './views/star-gazers/star-gazers.component';

// routing
import { AppRoutingModule } from './app-routing.module';
import { OrderByPipe } from './pipes/order-by.pipe';

// Pipes
import { KeysPipe } from './pipes/keys.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CardRepositoryComponent,
    UserInfoComponent,
    OrderByPipe,
    StarGazersComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
