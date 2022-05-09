import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'src/app/core/services/core/window.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  windowReference: Window;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  redirectToOnboarding(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName.split('/onboarding')[1] === '') {
      this.router.navigate([`/workspaces/onboarding/landing`]);
    }
  }

  ngOnInit(): void {
    const workspaceId = this.route.snapshot.params.workspace_id;
    this.redirectToOnboarding();
  }

}
