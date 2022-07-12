import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPipe } from '../../../pipes/search.pipe';
import { ConfigurationSelectFieldComponent } from './configuration-select-field.component';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployeeSettingFormOption } from 'src/app/core/models/configuration/employee-setting.model';
import { EmployeeFieldMapping } from 'src/app/core/models/enum/enum.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ConfigurationSelectFieldComponent', () => {
  let component: ConfigurationSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationSelectFieldComponent>;
  let formBuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ ConfigurationSelectFieldComponent, SearchPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSelectFieldComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
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
    component.enableTextsearch = false;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  // Figure out a way to send the data to the component [@Input()]
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showQBOExportPreview function check', () => {
    component.showQBOExportPreview(null, null);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('HTML check', () => {
    const configurationHeaderdiv = fixture.debugElement.query(By.css('.configuration--field-header'));
    const configurationH5 = fixture.debugElement.queryAll(By.css('h5'));
    expect(configurationHeaderdiv.nativeElement.innerText).toBe(component.label+' *');
    expect(configurationH5[0].nativeElement.innerText).toBe(component.subLabel);
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
