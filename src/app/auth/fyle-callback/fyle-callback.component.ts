import { Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-fyle-callback',
  templateUrl: './fyle-callback.component.html',
  styleUrls: ['./fyle-callback.component.scss']
})
export class FyleCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  private redirectToLogin(): void {
    this.authService.logout();
    this.router.navigate(['auth/login']);
    this.snackBar.open(`You don't have administrator access to this page, please contact support@fylehq.com if you need further assistance on this`, '', {
      duration: 7000
    });
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

  private login(): void {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.saveUserProfileAndNavigate(params.code);
      } else if (params.error) {
        this.redirectToLogin();
      }
    });
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();

    this.login();
  }

}
