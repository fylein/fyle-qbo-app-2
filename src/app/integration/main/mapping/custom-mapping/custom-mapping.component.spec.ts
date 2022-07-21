import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMappingComponent } from './custom-mapping.component';

describe('CustomMappingComponent', () => {
  let component: CustomMappingComponent;
  let fixture: ComponentFixture<CustomMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
