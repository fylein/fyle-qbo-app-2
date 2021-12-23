import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboCallbackComponent } from './qbo-callback.component';

describe('QboCallbackComponent', () => {
  let component: QboCallbackComponent;
  let fixture: ComponentFixture<QboCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
