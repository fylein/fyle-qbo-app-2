import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportErrorsComponent } from './dashboard-export-errors.component';

xdescribe('DashboardExportErrorsComponent', () => {
  let component: DashboardExportErrorsComponent;
  let fixture: ComponentFixture<DashboardExportErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExportErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
