import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfigurationMultiSelectFieldComponent } from './configuration-multi-select-field.component';

describe('ConfigurationMultiSelectFieldComponent', () => {
  let component: ConfigurationMultiSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationMultiSelectFieldComponent>;
  let formBuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ ConfigurationMultiSelectFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationMultiSelectFieldComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    const form = new FormGroup({
      employeeMapping: new FormControl(['EMPLOYEE']),
      autoMapEmployee: new FormControl([true]),
      emails: new FormControl(['fyle@fyle.in', 'integrations@fyle.in' ])
    });
    const employeeMappingOptions: EmployeeSettingFormOption[] = [
      {
        value: EmployeeFieldMapping.EMPLOYEE,
        label: 'Employees'
      },
      {
        value: EmployeeFieldMapping.VENDOR,
        label: 'Vendors'
      }
    ];
    const liveEntityExample = {EMPLOYEE: 'FYLE', VENDOR: 'Integration'};
    component.form = form;
    component.options = employeeMappingOptions;
    component.liveEntityExample = liveEntityExample;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
    component.mandatoryErrorListName = 'option';
    component.iconPath = 'assets/images/svgs/general/employee.svg';
    component.label = 'How are your Employees represented in Quickbooks Online?';
    component.subLabel = 'Select how you represent your employees in QBO. This would help to export the expenses from Fyle to the correct employee/vendor record in QBO.';
    component.placeholder = 'Select representation';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete function check', () => {
    const event = new Event("click", undefined);
    expect(component.delete(event, 'fyle@fyle.in')).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.controls.emails.value).toEqual(['integrations@fyle.in']);
    expect(component.delete(event, 'fyle@fyle.in', true)).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.controls.emails.value).toBeNull();
  });
});
