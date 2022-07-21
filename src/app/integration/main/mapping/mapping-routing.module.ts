import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericMappingComponent } from 'src/app/shared/components/mapping/generic-mapping/generic-mapping.component';
import { CustomMappingComponent } from './custom-mapping/custom-mapping.component';
import { EmployeeMappingComponent } from './employee-mapping/employee-mapping.component';
import { MappingComponent } from './mapping.component';

const routes: Routes = [
  {
    path: '',
    component: MappingComponent,
    children: [
      {
        path: 'employee',
        component: EmployeeMappingComponent
      },
      {
        path: 'custom',
        component: CustomMappingComponent
      },
      {
        path: ':source_field',
        component: GenericMappingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MappingRoutingModule { }
