import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { QboConnectorComponent } from './qbo-connector.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('QboConnectorComponent', () => {
  let component: QboConnectorComponent;
  let fixture: ComponentFixture<QboConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule,MatSnackBarModule],
      declarations: [ QboConnectorComponent ]
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
