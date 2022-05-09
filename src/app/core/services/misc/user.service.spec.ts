import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { MinimalUser } from '../../models/db/user.model';
import { UserService } from './user.service';
import { environment } from 'environment.localhost';

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
  const realuser = localStorage.getItem('user')

  it('getUserdetails service', () => {
    const response:MinimalUser = {
      access_token: "fyle",
      email: "sravan.kumar@fyle.in",
      full_name: "sravan k",
      org_id: "orunxXsIajSE",
      org_name: "Test Sample Statement - GBP",
      refresh_token: "fyle",
      user_id: "ust5Ga9HC3qc",
    };
    const actualResponse:MinimalUser = service.getUserProfile();
    actualResponse.access_token="fyle";
    actualResponse.refresh_token='fyle';
    expect(actualResponse).toEqual(response || null);
  })

  it('setUserDetails service', () => {
    const user:MinimalUser = {
      access_token: "fyle",
      email: "sravan.kumar@fyle.in",
      full_name: "sravan k",
      org_id: "orunxXsIajSE",
      org_name: "Test Sample Statement - GBP",
      refresh_token: "fyle",
      user_id: "ust5Ga9HC3qc",
    };
    service.storeUserProfile(user);
    const response = localStorage.getItem('user');
    expect(response).toBeDefined();
    localStorage.setItem('user',environment.tests.user)
  })

  it('storeFyleOrgsCount service', (done) => {
    service.storeFyleOrgsCount();
    const response = localStorage.getItem('orgsCount');
    if(response == 'null'){
      expect(response).toBeNull()
    }
    expect(response).toBe('1')
    done();
  })
});
