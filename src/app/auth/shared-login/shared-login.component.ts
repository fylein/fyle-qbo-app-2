import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { StorageService } from 'src/app/core/services/core/storage.service';

@Component({
  selector: 'app-shared-login',
  templateUrl: './shared-login.component.html',
  styleUrls: ['./shared-login.component.scss']
})
export class SharedLoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) { }

  private login(): void {
    this.route.queryParams.subscribe(params => {
      const localStorageDump = JSON.parse(params.local_storage_dump);
      Object.keys(localStorageDump).forEach(key => {
        this.storageService.set(key, localStorageDump[key]);
      });
    });

    this.router.navigate(['/workspaces']);
  }

  ngOnInit(): void {
    this.authService.checkLoginStatusAndLogout();

    this.login();
  }

}
