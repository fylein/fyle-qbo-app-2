import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogChildDialogComponent } from './export-log-child-dialog.component';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('ExportLogChildDialogComponent', () => {
  let component: ExportLogChildDialogComponent;
  let fixture: ComponentFixture<ExportLogChildDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogChildDialogComponent ],
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogChildDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
