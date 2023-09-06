import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { Router } from '@angular/router';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { of } from 'rxjs';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let formBuilder: FormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

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
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showQboExportPreview function check', () => {
    component.showQboExportPreview(ReimbursableExpensesObject.BILL, null);
    expect(dialogSpy).toHaveBeenCalled();
  });
});
