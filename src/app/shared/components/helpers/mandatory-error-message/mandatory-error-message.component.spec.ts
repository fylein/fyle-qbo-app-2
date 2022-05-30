import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryErrorMessageComponent } from './mandatory-error-message.component';

xdescribe('MandatoryErrorMessageComponent', () => {
  let component: MandatoryErrorMessageComponent;
  let fixture: ComponentFixture<MandatoryErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatoryErrorMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
