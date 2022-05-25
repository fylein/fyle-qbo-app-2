import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogModule,MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseFieldCreationDialogComponent } from './expense-field-creation-dialog.component';

xdescribe('ExpenseFieldCreationDialogComponent', () => {
  let component: ExpenseFieldCreationDialogComponent;
  let fixture: ComponentFixture<ExpenseFieldCreationDialogComponent>;
  const existingFields = ['project'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MatDialogModule, FormsModule, ReactiveFormsModule],
      declarations: [ ExpenseFieldCreationDialogComponent ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            width: '551px',
            data: existingFields
          }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseFieldCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
