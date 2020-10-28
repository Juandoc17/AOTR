import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'panel', canActivate: [AuthGuardService], loadChildren: './panel/panel.module#PanelModule' },
  { path: '**', redirectTo: 'auth' },
  { path: '', pathMatch: 'full', redirectTo: 'panel' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
