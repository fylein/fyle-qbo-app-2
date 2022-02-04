import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { DestinationAttribute, GroupedDestinationAttribute } from '../models/destination-attribute.model';
import { ExpenseField } from '../models/expense-field.model';
import { ApiService } from './api.service';
import { WorkspaceService } from './workspace.service';

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
}
