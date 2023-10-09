import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {OverviewComponent} from './pages/overview/overview.component';
import {NavigatedRootComponent} from './components/navigated-root/navigated-root.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import { ProblemsComponent } from './pages/problems/problems.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    NavigatedRootComponent,
    ProblemsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
