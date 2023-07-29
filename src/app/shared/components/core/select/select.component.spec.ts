import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { Router } from '@angular/router';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let dialogSpy: jasmine.Spy;
  let formBuilder: FormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectComponent, SearchPipe ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy }
      ],
      imports: [
        MatDialogModule, NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);
    const form = new FormGroup({
      employeeMapping: new FormControl(['EMPLOYEE']),
      autoMapEmployee: new FormControl([true]),
      emails: new FormControl(['fyle@fyle.in', 'integrations@fyle.in' ])
    });
    component.form = form;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
    component.mandatoryErrorListName = 'option';
    component.placeholder = 'Select representation';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
