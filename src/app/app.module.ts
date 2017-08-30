import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// materialize
import { MaterializeModule } from "angular2-materialize";

// components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
