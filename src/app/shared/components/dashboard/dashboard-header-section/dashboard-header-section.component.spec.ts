import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHeaderSectionComponent } from './dashboard-header-section.component';

describe('DashboardHeaderSectionComponent', () => {
  let component: DashboardHeaderSectionComponent;
  let fixture: ComponentFixture<DashboardHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
