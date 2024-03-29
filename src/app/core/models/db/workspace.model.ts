import { OnboardingState } from "../enum/enum.model";

export type Workspace = {
  id: number;
  name: string;
  user: number[];
  fyle_org_id: string;
  fyle_currency: string;
  qbo_realm_id: string;
  cluster_domain: string;
  onboarding_state: OnboardingState;
  last_synced_at: Date;
  ccc_last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  created_at: Date;
  updated_at: Date;
}
