import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExportLogComponent } from './export-log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from "@angular/material/dialog";


describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ],
      imports: [FormsModule, ReactiveFormsModule, MatDialogModule, RouterTestingModule, HttpClientModule],
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
    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
