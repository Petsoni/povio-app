import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {OverviewComponent} from "./pages/overview/overview.component";
import {ProblemsComponent} from "./pages/problems/problems.component";
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'overview', pathMatch: 'full', component: OverviewComponent},
  {path: 'problems', pathMatch: 'full', component: ProblemsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
