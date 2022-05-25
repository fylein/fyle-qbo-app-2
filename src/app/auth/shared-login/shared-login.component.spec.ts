import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLoginComponent } from './shared-login.component';

xdescribe('SharedLoginComponent', () => {
  let component: SharedLoginComponent;
  let fixture: ComponentFixture<SharedLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
