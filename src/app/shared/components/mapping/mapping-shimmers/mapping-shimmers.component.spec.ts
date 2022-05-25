import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingShimmersComponent } from './mapping-shimmers.component';

xdescribe('MappingShimmersComponent', () => {
  let component: MappingShimmersComponent;
  let fixture: ComponentFixture<MappingShimmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingShimmersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingShimmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
