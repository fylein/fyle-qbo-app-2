import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogModule} from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportSettingsComponent } from './import-settings.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

xdescribe('ImportSettingsComponent', () => {
  let component: ImportSettingsComponent;
  let fixture: ComponentFixture<ImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule,RouterTestingModule,HttpClientModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatSnackBarModule],
      declarations: [ ImportSettingsComponent ],
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
    fixture = TestBed.createComponent(ImportSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
