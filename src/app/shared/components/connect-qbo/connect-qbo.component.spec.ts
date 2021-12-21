import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectQboComponent } from './connect-qbo.component';

describe('ConnectQboComponent', () => {
  let component: ConnectQboComponent;
  let fixture: ComponentFixture<ConnectQboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectQboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectQboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
