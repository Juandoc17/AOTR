import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { VinsComponent } from './vins/vins.component';
import { VinDetailComponent} from './vin-detail/vin-detail.component';

const routes: Routes = [
  {
    path: '', component: NavbarComponent, children: [
      { path: 'cases', component: VinsComponent},
      { path: 'cases/case-detail/:_id', component: VinDetailComponent},
      { path: '', redirectTo: 'cases' },
      { path: '**', redirectTo: 'cases' },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
