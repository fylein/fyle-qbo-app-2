import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationQboConnectorComponent } from './configuration-qbo-connector.component';

describe('ConfigurationQboConnectorComponent', () => {
  let component: ConfigurationQboConnectorComponent;
  let fixture: ComponentFixture<ConfigurationQboConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationQboConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationQboConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
