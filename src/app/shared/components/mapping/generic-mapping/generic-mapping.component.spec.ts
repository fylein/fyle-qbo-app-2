import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { GenericMappingComponent } from './generic-mapping.component';

xdescribe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMappingComponent ],
      imports: [ RouterTestingModule,FormsModule,ReactiveFormsModule,HttpClientModule,MatSnackBarModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
