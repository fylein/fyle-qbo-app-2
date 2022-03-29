import { OnboardingStateComponentMap } from "../enum/enum.model";

export type Workspace = {
  id: number;
  name: string;
  user: number[];
  fyle_org_id: string;
  qbo_realm_id: string;
  cluster_domain: string;
  onboarding_state: OnboardingStateComponentMap;
  last_synced_at: Date;
  source_synced_at: Date;
  destination_synced_at: Date;
  created_at: Date;
  updated_at: Date;
}
