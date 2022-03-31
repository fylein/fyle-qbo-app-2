import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogComponent } from './export-log.component';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ],
      imports: [MatDialogModule, MAT_DIALOG_DATA, MatDialogRef]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
