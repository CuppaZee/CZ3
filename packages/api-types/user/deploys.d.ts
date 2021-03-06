import { EndpointBase, Response } from "../common";

export interface UserDeploys extends EndpointBase {
  path: "user/deploys";
  params: {
    user_id: number;
    page?: number;
    type_id?: number;
  };
  response: Response<{
    has_more: 0 | 1;
    munzees: {
      munzee_id: string;
      friendly_name: string;
      deployed_at: string;
      points: number;
      creator_username: string;
      munzee_code: string;
      last_captured_at: string;
      last_captured_by_id: string;
      capture_type_id: string;
      number_of_captures: number;
      notes: string;
      latitude: string;
      longitude: string;
      maintenance: string;
      last_captured_username: string;
      last_captured_at_unix: number;
      deployed_at_unix: number;
      url: string;
      virtual: number;
      pin_icon: string;
    }[];
  }>;
}
export interface UserDeploysMap extends EndpointBase {
  path: "user/deploys/map";
  params: {
    user_id: number;
    page?: number;
    type_id?: number;
  };
  response: Response<
    {
      deployed_at: string;
      id: string;
      la: string;
      lo: string;
      n: string;
      reset_at: string | null;
      i: string;
      u: string;
    }[]
  >;
}
