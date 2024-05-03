import { Routes } from '@angular/router';
import {LayoutComponent} from "./shared/components/layout/layout.component";
import {GameboardComponent} from "./game/gameboard/gameboard.component";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'game',
  },
  {
    path: 'game',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: GameboardComponent
      }
    ]
  },
];
