import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {
    this.authService.redirectToFyleOAuth();
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
