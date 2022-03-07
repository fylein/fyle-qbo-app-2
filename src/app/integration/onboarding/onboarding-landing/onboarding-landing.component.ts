import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/core/auth.service';

@Component({
  selector: 'app-onboarding-landing',
  templateUrl: './onboarding-landing.component.html',
  styleUrls: ['./onboarding-landing.component.scss']
})
export class OnboardingLandingComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  connectQbo(): void {
    this.authService.redirectToQboOAuth();
  }

  ngOnInit(): void {
  }

}
