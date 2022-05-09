import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MappingSetting, MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { EmployeeFieldMapping, FyleField } from 'src/app/core/models/enum/enum.model';
import { DashboardModule, DashboardModuleChild } from 'src/app/core/models/misc/dashboard-module.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLoading: boolean = true;
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
      route: 'export_log',
      iconPath: 'assets/images/svgs/general/export-log',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Mappings',
      route: 'mapping',
      iconPath: 'assets/images/svgs/general/mapping',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Employee Mapping',
          route: 'mapping/employee',
          isActive: false
        },
        {
          name: 'Category Mapping',
          route: 'mapping/category',
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
    private router: Router,
    private mappingService: MappingService
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
    if (typeof(route) === 'undefined') {
      this.router.navigate(['/workspaces/main/dashboard']);
    } else {
      // Filter module list to find the module that matches the route and mark it as active
      this.modules = this.modules.map(m => {
        if (m.childPages) {
          m.childPages.forEach(c => {
            if (c.route === route) {
              c.isActive = true;
              m.isActive = true;
              m.isExpanded = true;
            } else {
              c.isActive = false;
            }
          });
        }

        if (m.route === route) {
          m.isActive = true;
        }

        return m;
      });
    }

  }

  setupMappingPages(): void {
    this.mappingService.getMappingSettings().subscribe((mappingSettingResponse: MappingSettingResponse) => {
      const sourceFieldRoutes: string[] = [`mapping/${FyleField.EMPLOYEE.toLowerCase()}`, `mapping/${FyleField.CATEGORY.toLowerCase()}`];
      mappingSettingResponse.results.forEach((mappingSetting: MappingSetting) => {
        if (mappingSetting.source_field !== EmployeeFieldMapping.EMPLOYEE && mappingSetting.source_field !== FyleField.CATEGORY) {
          sourceFieldRoutes.push(`mapping/${mappingSetting.source_field.toLowerCase()}`);
          this.modules[2].childPages.push({
            name: `${mappingSetting.source_field.toLowerCase()} Mapping`,
            route: `mapping/${mappingSetting.source_field.toLowerCase()}`,
            isActive: false
          });
        }
      });

      // remove dead mappings
      this.modules[2].childPages = this.modules[2].childPages.filter(c => sourceFieldRoutes.includes(c.route));

      this.markModuleActive(this.router.url);
      this.isLoading = false;
    });
  }

  private setRouteWatcher(): void {
    this.setupMappingPages();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        const splitUrl = val.url.split('?');
        if (splitUrl.length > 1 && splitUrl[1].includes('refreshMappings')) {
          this.setupMappingPages();
        }
        this.markModuleActive(splitUrl[0]);
      }
    });
  }

  ngOnInit(): void {
    this.setRouteWatcher();
  }

}
