import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup} from '@angular/forms';
import { AutoMapEmployee, EmployeeFieldMapping } from '../enum/enum.model';
import { EmployeeSettingModel, EmployeeSettingPost } from './employee-setting.model';
describe(' EmployeeSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ EmployeeSettingModel ]
    })
    .compileComponents();
  });

  it('Should return EmployeeSettingModel[]', () => {
    const employeeSettingsForm= new FormGroup({
      employeeMapping: new FormControl('EMPLOYEE'),
      autoMapEmployee: new FormControl('EMPLOYEE_CODE'),
    });
    const employeeSettingPayload: EmployeeSettingPost= {
      workspace_general_settings: {
        employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
        auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
      }
    };
    expect(EmployeeSettingModel.constructPayload(employeeSettingsForm)).toEqual(employeeSettingPayload);
  });
});
