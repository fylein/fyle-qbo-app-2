import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QboCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: this.route.snapshot.queryParams.code,
        realmId: this.route.snapshot.queryParams.realmId
      }
    };

    this.router.navigate([`workspaces/${this.route.snapshot.queryParams.state}/onboarding/qbo_connector`], navigationExtras);
  }
}
