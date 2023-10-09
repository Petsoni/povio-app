import { Component } from '@angular/core';
import {InternalRoutes} from "../../../models/InteralRoutes";
import {mainRoutingPaths} from "../../app-internal-routing";
import {MatDrawer, MatDrawerMode} from "@angular/material/sidenav";

@Component({
  selector: 'app-navigated-root',
  templateUrl: './navigated-root.component.html',
  styleUrls: ['./navigated-root.component.scss']
})
export class NavigatedRootComponent {

  mode: MatDrawerMode = "side";
  links: InternalRoutes[] = [];

  constructor() {
    this.links = mainRoutingPaths;
  }
}
