import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipExportLogTableComponent } from './skip-export-log-table.component';

describe('SkipExportLogTableComponent', () => {
  let component: SkipExportLogTableComponent;
  let fixture: ComponentFixture<SkipExportLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkipExportLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkipExportLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
