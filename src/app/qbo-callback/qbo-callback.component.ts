import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QboConnector } from '../core/models/qbo-connector.model';
import { QboConnectorService } from '../core/services/qbo-connector.service';

@Component({
  selector: 'app-qbo-callback',
  templateUrl: './qbo-callback.component.html',
  styleUrls: ['./qbo-callback.component.scss']
})
export class QboCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qboConnectorService: QboConnectorService
  ) { }

  ngOnInit(): void {
    const workspaceId: number = this.route.snapshot.queryParams.state;
    const code: string = this.route.snapshot.queryParams.code;
    const realmId: string = this.route.snapshot.queryParams.realmId;

    const qboAuthResponse: QboConnector = {
      code: code,
      realm_id: realmId
    };

    this.qboConnectorService.connectQBO(qboAuthResponse).subscribe(() => {
      // Do nothing
      this.router.navigateByUrl(`workspaces/${workspaceId}/onboarding/qbo_connector`);
    }, () => {
      // TODO: Handle error
    });
  }

}
