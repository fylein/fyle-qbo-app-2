import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogModule} from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportSettingsComponent } from './import-settings.component';

describe('ImportSettingsComponent', () => {
  let component: ImportSettingsComponent;
  let fixture: ComponentFixture<ImportSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule,RouterTestingModule,HttpClientModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatSnackBarModule],
      declarations: [ ImportSettingsComponent ]
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
