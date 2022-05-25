import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { ExportSettingsComponent } from './export-settings.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

xdescribe('ExportSettingsComponent', () => {
  let component: ExportSettingsComponent;
  let fixture: ComponentFixture<ExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule,HttpClientModule,RouterTestingModule,MatSnackBarModule],
      declarations: [ ExportSettingsComponent ],
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
    fixture = TestBed.createComponent(ExportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
