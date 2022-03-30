import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FyleCallbackComponent } from './fyle-callback.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';

describe('FyleCallbackComponent', () => {
  let component: FyleCallbackComponent;
  let fixture: ComponentFixture<FyleCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule,MatSnackBarModule],
      declarations: [ FyleCallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FyleCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
