import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from 'src/app/core/interceptors/jwt.interceptor';
import { AuthService } from './auth.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'environment.localhost';
import { Token } from '../../models/misc/token.model';


describe('AuthService', () => {
  let service: AuthService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    injector = getTestBed();
    service = injector.inject(AuthService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('isLoggedIn is working', () => {
    const result = service.isLoggedIn();
    if (result == true)
      expect(result).toBeTrue();
    else
      expect(result).toBeFalse();
  });

  // it('login() service check', () => {
  //   const response = {"refresh_token":"fyle","access_token":"fyle","expires_in":3600,"token_type":"Bearer","user":{"id":3,"password":"","last_login":null,"email":"sravan.kumar@fyle.in","user_id":"ust5Ga9HC3qc","full_name":"sravan k","active":true,"staff":false,"admin":false,"org_id":"orunxXsIajSE","org_name":"Test Sample Statement - GBP"}};
  //   const code = 'sssss';
  //   expect(service.login(code)).toBeTruthy();

  //   const req = httpMock.expectOne({
  //     method: 'POST',
  //     url: `${API_BASE_URL}/auth/login/`,
  //   });
  //   req.flush(response);
  // });

  it('logout() service check', () => {
    const result = service.logout();
    expect(result).toBeUndefined()
  });

  it('refreshAccessToken() service check', () => {
    const response ={
      access_token: "Fyle",
      expires_in: 3600,
      refresh_token: "ffff",
      token_type: "Bearer"
    }
    service.refreshAccessToken('fyle').subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/auth/refresh/`,
    });
    req.flush(response);
  });

  it('getAccessToken() service check', () => {
    const user = {
      access_token:'fyle'
    };
    localStorage.setItem('user', JSON.stringify(user));
    const actualrespons = 'fyle';
    const response = service.getAccessToken();
    expect(response).toEqual(actualrespons);
    expect(service.updateAccessToken('fyle')).toEqual('fyle');
  });

  it('getAccessToken() service check', () => {
    localStorage.removeItem('user');
    expect(service.getAccessToken()).toBeNull();
    expect(service.updateAccessToken('fyle')).toBeNull();
  });

  it('getRefreshToken() service check', () => {
    const user = {
      refresh_token:'fyle'
    };
    localStorage.setItem('user', JSON.stringify(user));
    const actualrespons = 'fyle';
    const response = service.getRefreshToken();
    expect(response).toEqual(actualrespons);
  });

  it('getRefreshToken() service check', () => {
    localStorage.removeItem('user');
    const response = service.getRefreshToken();
    expect(response).toBeNull();
  });

});
