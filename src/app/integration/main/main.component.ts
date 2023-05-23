import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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

  showWalkThroughTooltip: boolean;

  @ViewChild('walkthrough') walkthrough: ElementRef;

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
      name: 'Export Log',
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
      childPages: []
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
    private renderer: Renderer2,
    private router: Router,
    private mappingService: MappingService
  ) {
    // Helps refresh sidenav bar on mapping setting change
    this.mappingService.getMappingPagesForSideNavBar.subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.setupMappingModules(mappingSettingResponse);
    });

    // Subscribe to the event that is emitted when custom mapping is created
    this.mappingService.showWalkThroughTooltip.subscribe(() => {
      this.showWalkThroughTooltip = true;
    });

    // Listen to clicks and auto hide the walkthrough tooltip
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.showWalkThroughTooltip && this.walkthrough?.nativeElement && e.target !== this.walkthrough?.nativeElement) {
        this.showWalkThroughTooltip = false;
      }
    });
  }

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
              c.isActive = false;
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
      const route = module.route.split("/", 3)
      if(route.length === 3) {
        module.route = route[0]+'/'+route[1]+'_'+route[2];
      }
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

  private setupMappingModules(mappingSettingResponse: MappingSettingResponse): void {
    this.modules[2].childPages = [{
      name: 'Employee Mapping',
      route: 'mapping/employee',
      isActive: false
    },
    {
      name: 'Category Mapping',
      route: 'mapping/category',
      isActive: false
    }];

    const sourceFieldRoutes: string[] = [`mapping/${FyleField.EMPLOYEE.toLowerCase()}`, `mapping/${FyleField.CATEGORY.toLowerCase()}`];
    const importedFieldsFromQBO = [];
    mappingSettingResponse.results.forEach((mappingSetting: MappingSetting) => {
      if (mappingSetting.source_field !== EmployeeFieldMapping.EMPLOYEE && mappingSetting.source_field !== FyleField.CATEGORY) {
        if (mappingSetting.import_to_fyle) {
          importedFieldsFromQBO.push(mappingSetting.destination_field);
        }
        sourceFieldRoutes.push(`mapping/${mappingSetting.source_field.toLowerCase()}`);
        this.modules[2].childPages.push({
          name: `${mappingSetting.source_field.toLowerCase()} Mapping`,
          route: `mapping/${mappingSetting.source_field.toLowerCase()}`,
          isActive: false
        });
      }
    });

    // Show Custom Mapping menu if atleast one QBO field is available to be mapped
    if (importedFieldsFromQBO.length < 3) {
      this.modules[2].childPages.push({
        name: 'Custom Mapping',
        route: 'mapping/custom',
        isActive: false
      });
    }

    this.markModuleActive(this.router.url);
    this.isLoading = false;
  }

  getSettingsAndSetupPage(): void {
    this.mappingService.getMappingSettings().subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.setupMappingModules(mappingSettingResponse);
    });
  }

  private setRouteWatcher(): void {
    this.getSettingsAndSetupPage();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        const splitUrl = val.url.split('?');
        this.markModuleActive(splitUrl[0]);
      }
    });
  }

  ngOnInit(): void {
    this.setRouteWatcher();
  }

}
