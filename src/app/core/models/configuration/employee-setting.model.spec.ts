import { TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import { AutoMapEmployee, EmployeeFieldMapping } from '../enum/enum.model';
import { EmployeeSettingModel, EmployeeSettingPost } from './employee-setting.model';
describe(' EmployeeSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntypedFormGroup],
      declarations: [ EmployeeSettingModel ]
    })
    .compileComponents();
  });

  it('Should return EmployeeSettingModel[]', () => {
    const employeeSettingsForm= new UntypedFormGroup({
      employeeMapping: new UntypedFormControl('EMPLOYEE'),
      autoMapEmployee: new UntypedFormControl('EMPLOYEE_CODE')
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
