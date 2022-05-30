import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportComponent } from './dashboard-export.component';

xdescribe('DashboardExportComponent', () => {
  let component: DashboardExportComponent;
  let fixture: ComponentFixture<DashboardExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
