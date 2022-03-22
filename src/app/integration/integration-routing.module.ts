import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
import { IntegrationComponent } from './integration.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationComponent,
    children: [
      {
        path: ':workspace_id/onboarding',
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingModule)
      },
      {
        path: ':workspace_id/app',
        loadChildren: () => import('./post-onboarding/post-onboarding.module').then(m => m.PostOnboardingModule),
        canActivate: [WorkspacesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule { }
