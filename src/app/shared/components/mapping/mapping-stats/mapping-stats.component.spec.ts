import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingStatsComponent } from './mapping-stats.component';

describe('MappingStatsComponent', () => {
  let component: MappingStatsComponent;
  let fixture: ComponentFixture<MappingStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
