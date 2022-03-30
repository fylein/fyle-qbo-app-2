import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { ExportSettingsComponent } from './export-settings.component';

describe('ExportSettingsComponent', () => {
  let component: ExportSettingsComponent;
  let fixture: ComponentFixture<ExportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule,HttpClientModule,RouterTestingModule,MatSnackBarModule],
      declarations: [ ExportSettingsComponent ]
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
