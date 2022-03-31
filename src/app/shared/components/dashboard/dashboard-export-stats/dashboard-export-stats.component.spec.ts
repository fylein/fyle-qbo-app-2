import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExportStatsComponent } from './dashboard-export-stats.component';

describe('DashboardExportStatsComponent', () => {
  let component: DashboardExportStatsComponent;
  let fixture: ComponentFixture<DashboardExportStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExportStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExportStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
