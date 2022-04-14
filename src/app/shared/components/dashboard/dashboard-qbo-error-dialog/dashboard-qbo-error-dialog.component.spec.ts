import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQboErrorDialogComponent } from './dashboard-qbo-error-dialog.component';

describe('DashboardQboErrorDialogComponent', () => {
  let component: DashboardQboErrorDialogComponent;
  let fixture: ComponentFixture<DashboardQboErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardQboErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardQboErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
