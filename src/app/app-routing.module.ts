import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  {
    path: 'workspaces',
    loadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'qbo_callback',
    loadChildren: () => import('./qbo-callback/qbo-callback.module').then(m => m.QboCallbackModule)
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
