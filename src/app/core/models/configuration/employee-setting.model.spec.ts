import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup} from '@angular/forms';
import { EmployeeSettingModel } from './employee-setting.model'
describe(' EmployeeSettingModel', () => {
  let component: EmployeeSettingModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ EmployeeSettingModel ]
    })
    .compileComponents();
  });

  it('Should return EmployeeSettingModel[]', () => {
    let employeeSettingsForm= new FormGroup({
      employeeMapping: new FormControl([true]),
      autoMapEmployee: new FormControl(["dhaarani"]),
    })
    const employeeSettingPayload= {
      workspace_general_settings: {
        employee_field_mapping: employeeSettingsForm.get('employeeMapping')?.value,
        auto_map_employees: employeeSettingsForm.get('autoMapEmployee')?.value
      }
    };
    expect( EmployeeSettingModel.constructPayload(employeeSettingsForm)).toEqual(employeeSettingPayload);
   
  });
  });