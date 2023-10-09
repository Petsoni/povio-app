import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "./pages/overview/overview.component";
import {ProblemsComponent} from "./pages/problems/problems.component";

const routes: Routes = [
  {path: '', component: OverviewComponent},
  {path: 'problems', component: ProblemsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
