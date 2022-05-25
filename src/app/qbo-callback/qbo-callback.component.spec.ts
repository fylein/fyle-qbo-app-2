import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { QboCallbackComponent } from './qbo-callback.component';

xdescribe('QboCallbackComponent', () => {
  let component: QboCallbackComponent;
  let fixture: ComponentFixture<QboCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{path: 'qbo_callback', component: QboCallbackComponent}]), HttpClientModule],
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
