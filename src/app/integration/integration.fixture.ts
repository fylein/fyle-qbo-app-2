import { environment } from "src/environments/environment";
import { Workspace } from "../core/models/db/workspace.model";
import { OnboardingState } from "../core/models/enum/enum.model";

export const workspaceResponse:Workspace[] = [{
  id: +environment.tests.workspaceId,
  name: "Test Sample Statement - GBP",
  user: [1],
  fyle_org_id: "orunxXsIajSE",
  fyle_currency: "IND",
  qbo_realm_id: "",
  cluster_domain: "",
  onboarding_state: OnboardingState.CONNECTION,
  last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
  ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
  source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
  destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
  created_at: new Date("2022-04-13T10:29:18.796760Z"),
  updated_at: new Date("2022-04-13T10:29:18.796760Z")
}];
export const errorResponse = {
  status: 400,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'QBO'
  }
};