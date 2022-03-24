import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { DashboardModule, DashboardModuleChild } from 'src/app/core/models/misc/dashboard-module.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  modules: DashboardModule[] = [
    {
      name: 'Dashboard',
      route: 'dashboard',
      iconPath: 'assets/images/svgs/general/dashboard',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Export Logs',
      route: 'export-logs',
      iconPath: 'assets/images/svgs/general/export-log',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Mappings',
      route: 'mappings',
      iconPath: 'assets/images/svgs/general/mapping',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Employee Mapping',
          route: 'employee-mapping',
          isActive: false
        },
        {
          name: 'Category Mapping',
          route: 'category-mapping',
          isActive: false
        }
      ]
    },
    {
      name: 'Configuration',
      route: 'configuration',
      iconPath: 'assets/images/svgs/stepper/configuration',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Map Employees',
          route: 'configuration/employee_settings',
          isActive: false
        },
        {
          name: 'Export Settings',
          route: 'configuration/export_settings',
          isActive: false
        },
        {
          name: 'Import Settings',
          route: 'configuration/import_settings',
          isActive: false
        },
        {
          name: 'Advanced Settings',
          route: 'configuration/advanced_settings',
          isActive: false
        }
      ]
    }
  ];

  constructor(
    private router: Router
  ) { }

  navigate(module: DashboardModule | DashboardModuleChild): void {
    // Setting clicked module as active
    module.isActive = true;

    // Setting all other modules and child modules as inactive
    this.modules.forEach(m => {
      if (m.name !== module.name) {
        m.isActive = false;
        if (m.childPages) {
          m.childPages.forEach(c => {
            if (c.name !== module.name) {
              c.isActive = false
            }
          });
        }
      }
    });

    // Set parent module as active if child module is clicked
    const parentModule = this.modules.find(m => m.childPages.find(c => c.name === module.name));
    if (parentModule) {
      parentModule.isActive = true;
    }

    if (module.name === 'Mappings' || module.name === 'Configuration') {
      module.isExpanded = !module.isExpanded;
    } else {
      this.router.navigate([`/workspaces/main/${module.route}`]);
    }
  }

  private markModuleActive(path: string): void {
    const route = path.split('/workspaces/main/')[1];

    // Filter module list to find the module that matches the route and mark it as active
    this.modules = this.modules.map(m => {
      if (m.childPages) {
        m.childPages.forEach(c => {
          if (c.route === route) {
            c.isActive = true;
            m.isActive = true;
            m.isExpanded = true;
          }
        });
      }

      if (m.route === route) {
        m.isActive = true;
      }

      return m;
    });
  }

  private setRouteWatcher(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        this.markModuleActive(val.url)
      }
    });

    this.markModuleActive(this.router.url);
  }

  ngOnInit(): void {
    this.setRouteWatcher();
  }

}
