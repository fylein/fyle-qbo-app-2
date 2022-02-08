import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFormPreviewDialogComponent } from './expense-form-preview-dialog.component';

describe('ExpenseFormPreviewDialogComponent', () => {
  let component: ExpenseFormPreviewDialogComponent;
  let fixture: ComponentFixture<ExpenseFormPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseFormPreviewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseFormPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
