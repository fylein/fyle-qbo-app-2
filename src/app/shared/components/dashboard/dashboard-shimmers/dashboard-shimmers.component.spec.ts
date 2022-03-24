import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardShimmersComponent } from './dashboard-shimmers.component';

describe('DashboardShimmersComponent', () => {
  let component: DashboardShimmersComponent;
  let fixture: ComponentFixture<DashboardShimmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardShimmersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardShimmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
