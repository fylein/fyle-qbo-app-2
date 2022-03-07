import { Component, OnInit } from '@angular/core';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { UserService } from 'src/app/core/services/misc/user.service';

@Component({
  selector: 'app-onboarding-header',
  templateUrl: './onboarding-header.component.html',
  styleUrls: ['./onboarding-header.component.scss']
})
export class OnboardingHeaderComponent implements OnInit {

  user: MinimalUser;

  constructor(
    private userService: UserService
  ) { }

  private setupPage(): void {
    this.user = this.userService.getUserProfile();
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
