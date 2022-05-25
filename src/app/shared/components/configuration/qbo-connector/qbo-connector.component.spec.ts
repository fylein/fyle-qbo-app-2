import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { QboConnectorComponent } from './qbo-connector.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

xdescribe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule,MatSnackBarModule],
      declarations: [ QboConnectorComponent ],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
      JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
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
