import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { environment } from 'src/environments/environment';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { UserService } from 'src/app/core/services/misc/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  login(): void {
    const url = `${environment.fyle_app_url}/app/developers/#/oauth/authorize?client_id=${environment.fyle_client_id}&redirect_uri=${environment.callback_uri}&response_type=code`;
    const popup = window.open(url, "popup", "popup=true,width=500,height=800,left=500");
    const checkPopup = setInterval(() => {
      if (popup?.location?.href?.includes("code")) {
          let callbackURL = popup?.location.href
          popup.close()
          this.getQueryParam(callbackURL)
      }
      else if (!popup || !popup.closed) {
        return;
      }
      clearInterval(checkPopup);
    }, 1000);
  }

  private saveUserProfileAndNavigate(code: string): void {
    this.authService.login(code).subscribe(response => {
      const user: MinimalUser = {
        'email': response.user.email,
        'access_token': response.access_token,
        'refresh_token': response.refresh_token,
        'full_name': response.user.full_name,
        'user_id': response.user.user_id,
        'org_id': response.user.org_id,
        'org_name': response.user.org_name
      };
      this.userService.storeUserProfile(user);

      this.router.navigate(['/workspaces']);

      // Store orgs count in background, need not be a sync call
      this.userService.storeFyleOrgsCount();
    }, () => {
      this.redirectToLogin();
    });
  }
  
  private redirectToLogin(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
    this.snackBar.open(`You don't have administrator access to this page, please contact support@fylehq.com if you need further assistance on this`, '', {
      duration: 7000
    });
  }

  private getQueryParam(callbackURL:string): void {
    const code = callbackURL.substring(callbackURL.indexOf('=')+1, callbackURL.indexOf('&'))
    this.saveUserProfileAndNavigate(code);    
  }

  private redirectLoggedInUser(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/', 'workspaces']);
    }
  }

  ngOnInit(): void {
    this.redirectLoggedInUser();
  }
}