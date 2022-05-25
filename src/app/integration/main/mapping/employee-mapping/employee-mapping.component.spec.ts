import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EmployeeMappingComponent } from './employee-mapping.component';

xdescribe('EmployeeMappingComponent', () => {
  let component: EmployeeMappingComponent;
  let fixture: ComponentFixture<EmployeeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule,ReactiveFormsModule,HttpClientModule,MatSnackBarModule ],
      declarations: [ EmployeeMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
