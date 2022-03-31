import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogChildDialogComponent } from './export-log-child-dialog.component';

describe('ExportLogChildDialogComponent', () => {
  let component: ExportLogChildDialogComponent;
  let fixture: ComponentFixture<ExportLogChildDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogChildDialogComponent ]
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
