import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QboCallbackComponent } from './qbo-callback.component';


const routes: Routes = [
  {
    path: '',
    component: QboCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QboCallbackRoutingModule { }
