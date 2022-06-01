import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationStepHeaderSectionComponent } from './configuration-step-header-section.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('ConfigurationStepHeaderSectionComponent', () => {
  let component: ConfigurationStepHeaderSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderSectionComponent>;
  let router: Router;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, BrowserAnimationsModule],
      declarations: [ ConfigurationStepHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshQBODimensions() function check', () => {
    expect(component.refreshQBODimensions()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('ngOniti function check', () => {
    expect(component.ngOnInit()).toBeUndefined();
  });
});
