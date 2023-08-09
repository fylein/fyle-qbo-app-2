import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailMultiSelectComponent } from './email-multi-select.component';

describe('EmailMultiSelectComponent', () => {
  let component: EmailMultiSelectComponent;
  let fixture: ComponentFixture<EmailMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailMultiSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
