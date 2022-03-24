import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportLogComponent } from './export-log.component';

const routes: Routes = [
  {
    path: '',
    component: ExportLogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportLogRoutingModule { }
