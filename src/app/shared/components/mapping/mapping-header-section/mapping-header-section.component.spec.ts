import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MappingHeaderSectionComponent } from './mapping-header-section.component';

describe('MappingHeaderSectionComponent', () => {
  let component: MappingHeaderSectionComponent;
  let fixture: ComponentFixture<MappingHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientModule,MatSnackBarModule ],
      declarations: [ MappingHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
