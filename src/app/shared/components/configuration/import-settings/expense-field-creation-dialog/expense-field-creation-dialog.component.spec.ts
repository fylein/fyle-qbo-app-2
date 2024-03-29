import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ExpenseFieldCreationDialogComponent', () => {
  let component: ExpenseFieldCreationDialogComponent;
  let fixture: ComponentFixture<ExpenseFieldCreationDialogComponent>;
  const existingFields = ['project'];
  const dialogMock = {
    close: () => { }
  };
  let formBuilder: UntypedFormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: '' });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MatDialogModule, FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [ExpenseFieldCreationDialogComponent],
      providers: [
        UntypedFormBuilder,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            width: '551px',
            data: existingFields
          }
        },
        {
          provide: MatDialogRef,
          useValue: dialogMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    formBuilder = TestBed.inject(UntypedFormBuilder);
    fixture = TestBed.createComponent(ExpenseFieldCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Save function check', () => {
    const spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.save();
    expect(spy).toHaveBeenCalled();
    expect(component.save()).toBeUndefined();
    const form = formBuilder.group({
      name: ['Fyle'],
      placeholder: ['Category']
    });
    component.expenseFieldsCreationForm = form;
    fixture.detectChanges();
    component.save();
    expect(spy).toHaveBeenCalled();
    expect(component.save()).toBeUndefined();
  });

  it('Html content check', () => {
    const form = formBuilder.group({
      name: ['Fyle'],
      placeholder: ['Category']
    });
    component.expenseFieldsCreationForm = form;
    fixture.detectChanges();
    const expencefieldInput = fixture.debugElement.queryAll(By.css('input'));
    expect(expencefieldInput[1].nativeElement.placeholder).toBe(`Enter ${form.value.name}`);
    expect(expencefieldInput[0].nativeElement.value).toBe(form.value.name);
  });
});
