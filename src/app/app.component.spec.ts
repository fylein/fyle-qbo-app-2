import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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
    localStorage.setItem('workspaceId','5');
    localStorage.setItem('user','{"email":"sravan.kumar@fyle.in","access_token":"eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDkyMjIwNzEsImlzcyI6IkZ5bGVBcHAiLCJ1c2VyX2lkIjoidXN0NUdhOUhDM3FjIiwib3JnX3VzZXJfaWQiOiJvdUV0bEhJSjZjYWkiLCJvcmdfaWQiOiJvcnVueFhzSWFqU0UiLCJyb2xlcyI6IltcIkZZTEVSXCIsXCJBRE1JTlwiLFwiUEFZTUVOVF9QUk9DRVNTT1JcIixcIlZFUklGSUVSXCIsXCJGSU5BTkNFXCIsXCJBVURJVE9SXCJdIiwic2NvcGVzIjoiW10iLCJ0cGFfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwidHBhX25hbWUiOiJGeWxlIFFCTyBJbnRlZ3IuLiIsImFsbG93ZWRfQ0lEUnMiOiJbXSIsInZlcnNpb24iOiIzIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTY0OTIyNTY3MX0.3DvOO96o50Zl4RRl-vurljrRJgYQguHT7vh5WPOmCOg","refresh_token":"eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDkyMjIwNzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3VFdGxISUo2Y2FpXCIiLCJ0cGFfaWQiOiJcInRwYVlmVTdWTHlyRU5cIiIsInRwYV9uYW1lIjoiXCJGeWxlIFFCTyBJbnRlZ3IuLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTk2NDU4MjA3MX0.PTXHh5uuu3m1BLb87BUCeYTq9PtHsW65VSVfNF-6Ydo","full_name":"sravan k","user_id":"ust5Ga9HC3qc","org_id":"orunxXsIajSE","org_name":"Test Sample Statement - GBP"}')
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
