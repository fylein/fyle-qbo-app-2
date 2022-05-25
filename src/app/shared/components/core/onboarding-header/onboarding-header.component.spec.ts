import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OnboardingHeaderComponent } from './onboarding-header.component';
import { TrimCharacterPipe } from '../../../pipes/trim-character.pipe';

xdescribe('OnboardingHeaderComponent', () => {
  let component: OnboardingHeaderComponent;
  let fixture: ComponentFixture<OnboardingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule],
      declarations: [ OnboardingHeaderComponent,TrimCharacterPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('user variable check', () => {
    expect(component.user).toBeDefined();
  });
});
