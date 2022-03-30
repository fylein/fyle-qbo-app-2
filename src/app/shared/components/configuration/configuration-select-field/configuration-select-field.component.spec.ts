import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPipe } from '../../../pipes/search.pipe'
import { ConfigurationSelectFieldComponent } from './configuration-select-field.component';

describe('ConfigurationSelectFieldComponent', () => {
  let component: ConfigurationSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationSelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationSelectFieldComponent,SearchPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
