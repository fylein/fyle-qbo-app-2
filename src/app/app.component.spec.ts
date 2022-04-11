import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { testing_cred } from 'testing-credentials';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
    localStorage.setItem('workspaceId',testing_cred.workspaceId);
    localStorage.setItem('user',testing_cred.user)
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
