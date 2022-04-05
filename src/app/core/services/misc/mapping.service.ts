import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { DestinationAttribute, GroupedDestinationAttribute } from '../../models/db/destination-attribute.model';
import { EmployeeMapping, EmployeeMappingPost, EmployeeMappingsResponse } from '../../models/db/employee-mapping.model';
import { MappingState } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  workspaceId: string = this.workspaceService.getWorkspaceId()

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getQBODestinationAttributes(attributeTypes: string | string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/destination_attributes/`, {
      attribute_types: attributeTypes
    });
  }

  getDistinctQBODestinationAttributes(attributeTypes: string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/qbo_attributes/`, {
      attribute_types: attributeTypes
    });
  }

  getGroupedQBODestinationAttributes(attributeTypes: string[]): Observable<GroupedDestinationAttribute> {
    return from(this.getQBODestinationAttributes(attributeTypes).toPromise().then((response: DestinationAttribute[]) => {
      return response.reduce((groupedAttributes: GroupedDestinationAttribute | any, attribute: DestinationAttribute) => {
        const group: DestinationAttribute[] = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;

        return groupedAttributes;
      }, {
        BANK_ACCOUNT: [],
        CREDIT_CARD_ACCOUNT: [],
        ACCOUNTS_PAYABLE: [],
        VENDOR: [],
        ACCOUNT: [],
        TAX_CODE: []
      });
    }));
  }

  @Cacheable()
  getFyleExpenseFields(): Observable<ExpenseField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_fields/`, {});
  }

  getEmployeeMappings(mappingState: MappingState, allAlphabets: boolean, limit: number, offset: number, alphabetsFilter: string[]): Observable<EmployeeMappingsResponse> {
    return this.apiService.get(
      `/workspaces/${this.workspaceId}/mappings/employee/`,
      {
        limit,
        offset,
        all_alphabets: allAlphabets,
        mapping_state: mappingState,
        alphabets_filter: alphabetsFilter.length ? alphabetsFilter : null
      }
    );
  }

  postEmployeeMappings(employeeMapping: EmployeeMappingPost): Observable<EmployeeMapping> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/employee/`, employeeMapping);
  }

  triggerAutoMapEmployees(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }

  @Cacheable()
  getQBOEmployees(): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/employees/`, {});
  }

  @Cacheable()
  getQBOVendors(): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/qbo/vendors/`, {});
  }
}
