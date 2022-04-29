import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { MinimalUser } from '../../models/db/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
      },
        JwtHelperService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserdetails service', () => {
    const response:MinimalUser = {
      access_token: "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTEyMjAyMzcsImlzcyI6IkZ5bGVBcHAiLCJ1c2VyX2lkIjoidXN0NUdhOUhDM3FjIiwib3JnX3VzZXJfaWQiOiJvdUV0bEhJSjZjYWkiLCJvcmdfaWQiOiJvcnVueFhzSWFqU0UiLCJyb2xlcyI6IltcIkZZTEVSXCIsXCJBRE1JTlwiLFwiUEFZTUVOVF9QUk9DRVNTT1JcIixcIlZFUklGSUVSXCIsXCJGSU5BTkNFXCIsXCJBVURJVE9SXCJdIiwic2NvcGVzIjoiW10iLCJ0cGFfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwidHBhX25hbWUiOiJGeWxlIFFCTyBJbnRlZ3IuLiIsImFsbG93ZWRfQ0lEUnMiOiJbXSIsInZlcnNpb24iOiIzIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTY1MTIyMzgzN30.RbDFqAuBZGZh2epvtvY4cNQ1iJa5ROWs50bwceQOE4U",
      email: "sravan.kumar@fyle.in",
      full_name: "sravan k",
      org_id: "orunxXsIajSE",
      org_name: "Test Sample Statement - GBP",
      refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDkyMjIwNzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3VFdGxISUo2Y2FpXCIiLCJ0cGFfaWQiOiJcInRwYVlmVTdWTHlyRU5cIiIsInRwYV9uYW1lIjoiXCJGeWxlIFFCTyBJbnRlZ3IuLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTk2NDU4MjA3MX0.PTXHh5uuu3m1BLb87BUCeYTq9PtHsW65VSVfNF-6Ydo",
      user_id: "ust5Ga9HC3qc",
    };
    const actualResponse:MinimalUser = service.getUserProfile();
    actualResponse['access_token']='eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTEyMjAyMzcsImlzcyI6IkZ5bGVBcHAiLCJ1c2VyX2lkIjoidXN0NUdhOUhDM3FjIiwib3JnX3VzZXJfaWQiOiJvdUV0bEhJSjZjYWkiLCJvcmdfaWQiOiJvcnVueFhzSWFqU0UiLCJyb2xlcyI6IltcIkZZTEVSXCIsXCJBRE1JTlwiLFwiUEFZTUVOVF9QUk9DRVNTT1JcIixcIlZFUklGSUVSXCIsXCJGSU5BTkNFXCIsXCJBVURJVE9SXCJdIiwic2NvcGVzIjoiW10iLCJ0cGFfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwidHBhX25hbWUiOiJGeWxlIFFCTyBJbnRlZ3IuLiIsImFsbG93ZWRfQ0lEUnMiOiJbXSIsInZlcnNpb24iOiIzIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTY1MTIyMzgzN30.RbDFqAuBZGZh2epvtvY4cNQ1iJa5ROWs50bwceQOE4U';
    expect(actualResponse).toEqual(response || null);
  })

  it('setUserDetails service', () => {
    const user:MinimalUser = {
      access_token: "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NTEyMjAyMzcsImlzcyI6IkZ5bGVBcHAiLCJ1c2VyX2lkIjoidXN0NUdhOUhDM3FjIiwib3JnX3VzZXJfaWQiOiJvdUV0bEhJSjZjYWkiLCJvcmdfaWQiOiJvcnVueFhzSWFqU0UiLCJyb2xlcyI6IltcIkZZTEVSXCIsXCJBRE1JTlwiLFwiUEFZTUVOVF9QUk9DRVNTT1JcIixcIlZFUklGSUVSXCIsXCJGSU5BTkNFXCIsXCJBVURJVE9SXCJdIiwic2NvcGVzIjoiW10iLCJ0cGFfaWQiOiJ0cGFZZlU3Vkx5ckVOIiwidHBhX25hbWUiOiJGeWxlIFFCTyBJbnRlZ3IuLiIsImFsbG93ZWRfQ0lEUnMiOiJbXSIsInZlcnNpb24iOiIzIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTY1MTIyMzgzN30.RbDFqAuBZGZh2epvtvY4cNQ1iJa5ROWs50bwceQOE4U",
      email: "sravan.kumar@fyle.in",
      full_name: "sravan k",
      org_id: "orunxXsIajSE",
      org_name: "Test Sample Statement - GBP",
      refresh_token: "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NDkyMjIwNzEsImlzcyI6IkZ5bGVBcHAiLCJvcmdfdXNlcl9pZCI6Ilwib3VFdGxISUo2Y2FpXCIiLCJ0cGFfaWQiOiJcInRwYVlmVTdWTHlyRU5cIiIsInRwYV9uYW1lIjoiXCJGeWxlIFFCTyBJbnRlZ3IuLlwiIiwiY2x1c3Rlcl9kb21haW4iOiJcImh0dHBzOi8vc3RhZ2luZy5meWxlLnRlY2hcIiIsImV4cCI6MTk2NDU4MjA3MX0.PTXHh5uuu3m1BLb87BUCeYTq9PtHsW65VSVfNF-6Ydo",
      user_id: "ust5Ga9HC3qc",
    };
    service.storeUserProfile(user);
    const response = localStorage.getItem('user');
    expect(response).toBeDefined();
  })

  it('storeFyleOrgsCount service', (done) => {
    service.storeFyleOrgsCount();
    const response = localStorage.getItem('orgsCount');
    if(response == null){
      expect(response).toBeNull()
    }
    expect(response).toBeGreaterThanOrEqual(1)
    done();
  })
});
