import { EndpointBase, Response } from "../common";

export interface UserUndeploysMunzee {
  munzee_id: string;
  friendly_name: string;
  deployed_at: string;
  points: string;
  creator_username: string;
  munzee_code: string;
  capture_type_id: string;
  number_of_captures: number;
  notes: string;
  latitude: string;
  longitude: string;
  maintenance: string;
  pin_icon: string;
  last_captured_username?: string;
  last_captured_at_unix?: number;
  last_captured_at?: number;
  last_captured_by_id?: string;
  url: string;
  virtual?: 0 | 1;
  evolution?: 0 | 1;
  deployed_at_unix: number;
}

export interface UserUndeploys extends EndpointBase {
  path: "user/undeploys";
  params: {
    page?: number;
  };
  response: Response<{
    has_more: 0 | 1;
    munzees: UserUndeploysMunzee[];
  }>;
}
export interface UserUndeploysCountType {
  name: string;
  capture_type_id: string;
  count: string;
  pin_icon: string;
}

export interface UserUndeploysCount extends EndpointBase {
  path: "user/undeploys/count";
  params: {
    quickdeploy?: boolean;
    all_types?: boolean;
  };
  response: Response<UserUndeploysCountType[]>;
}
