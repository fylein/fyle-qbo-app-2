import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEmployeesComponent } from './map-employees.component';

describe('MapEmployeesComponent', () => {
  let component: MapEmployeesComponent;
  let fixture: ComponentFixture<MapEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapEmployeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
