import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostOnboardingComponent } from './post-onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: PostOnboardingComponent,
    children: [
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostOnboardingRoutingModule { }
