import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboConnectorComponent } from './qbo-connector.component';

describe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QboConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
