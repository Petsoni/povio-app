import {OverviewComponent} from "./pages/overview/overview.component";
import {InternalRoutes} from "../models/InteralRoutes";
import {ProblemsComponent} from "./pages/problems/problems.component";

export const mainRoutingPaths: InternalRoutes[] = [
  {
    path: 'overview',
    title: "Overview",
    icon: "home",
    component: OverviewComponent
  },
  {
    path: 'problems',
    title: "Problems",
    icon: "error",
    component: ProblemsComponent
  }
]

