import { getTestBed, TestBed } from '@angular/core/testing';
import { MinimalUser } from '../../models/db/user.model';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../core/api.service';

describe('UserService', () => {
  let service: UserService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let api:ApiService;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,HttpClientTestingModule],
      providers: [UserService]
    });
    injector = getTestBed();
    service = injector.inject(UserService);
    api = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });
  const realuser = localStorage.getItem('user');


  it('setUserDetails and getUserdetails service', () => {
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
    const actualResponse:MinimalUser = service.getUserProfile();
    const responseKeys = Object.keys(user).sort();
    const actualResponseKeys = Object.keys(actualResponse).sort();
    expect(actualResponseKeys).toEqual(responseKeys || null);
  });

  it('storeFyleOrgsCount count == 0 service', () => {
    localStorage.removeItem('orgsCount')
    service.storeFyleOrgsCount();
    const response = localStorage.getItem('orgsCount');
    expect(response).toBeNull();
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/user/orgs/`,
    });
      req.flush(2);
  });

  it('storeFyleOrgsCount service', () => {
    localStorage.setItem('orgsCount', '3');
    service.storeFyleOrgsCount();
    const response = localStorage.getItem('orgsCount');
    expect(response).toEqual('3');
  });
});
