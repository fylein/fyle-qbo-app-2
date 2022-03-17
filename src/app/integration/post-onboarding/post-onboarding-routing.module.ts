import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostOnboardingComponent } from './post-onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: PostOnboardingComponent
  },
  {
    path: '',
    component: PostOnboardingComponent,
    children: [
      // {
      //   path: 'configuration',
      //   component: ,
      //   canActivate: [WorkspacesGuard]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostOnboardingRoutingModule { }
