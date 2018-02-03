import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

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

// Pipes
import { OrderByPipe } from './pipes/order-by.pipe';
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
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
