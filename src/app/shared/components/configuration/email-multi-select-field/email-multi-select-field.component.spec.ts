import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

import { EmailMultiSelectFieldComponent } from './email-multi-select-field.component';

describe('EmailMultiSelectFieldComponent', () => {
  let component: EmailMultiSelectFieldComponent;
  let fixture: ComponentFixture<EmailMultiSelectFieldComponent>;

  let formBuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ EmailMultiSelectFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMultiSelectFieldComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    const form = formBuilder.group({
      searchOption: [],
      emails: [['fyle@fyle.in', 'integrations@fyle.in']],
      employeeMapping: [['EMPLOYEE']]
    });
    component.form = form;
    const adminEmails: any[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];
    const liveEntityExample = {EMPLOYEE: 'FYLE', VENDOR: 'Integration'};
    component.options = adminEmails;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
    component.label = 'How are your Employees represented in Quickbooks Online?';
    component.subLabel = 'Select how you represent your employees in QuickBooks Online. This would help to export the expenses from Fyle to the correct employee/vendor record in QuickBooks Online.';
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
