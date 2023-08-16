import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMultiSelectComponent } from './email-multi-select.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { FormBuilder } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('EmailMultiSelectComponent', () => {
  let component: EmailMultiSelectComponent;
  let fixture: ComponentFixture<EmailMultiSelectComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, NoopAnimationsModule],
      declarations: [ EmailMultiSelectComponent, SearchPipe ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMultiSelectComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    const form = formBuilder.group({
      searchOption: [],
      emails: [['fyle@fyle.in', 'integrations@fyle.in']],
      employeeMapping: [['EMPLOYEE']]
    });
    component.form = form;
    const adminEmails: any[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];
    component.options = adminEmails;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
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
