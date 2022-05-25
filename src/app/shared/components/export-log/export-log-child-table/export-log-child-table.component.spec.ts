import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogChildTableComponent } from './export-log-child-table.component';

xdescribe('ExportLogChildTableComponent', () => {
  let component: ExportLogChildTableComponent;
  let fixture: ComponentFixture<ExportLogChildTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogChildTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportLogChildTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
