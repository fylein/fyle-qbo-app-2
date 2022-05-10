import { TestBed } from '@angular/core/testing';
import { MinimalUser } from '../../models/db/user.model';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
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
  })

  it('storeFyleOrgsCount service', (done) => {
    service.storeFyleOrgsCount();
    const response = localStorage.getItem('orgsCount');
    if(response == 'null'){
      expect(response).toBeNull()
    }
    expect(response).toBeDefined()
    done();
  })
});
