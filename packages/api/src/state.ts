import type { Barn, ResourceDetails } from "./types";

export interface ResourceItem {
  barn: Barn;
  details: ResourceDetails;
}

export interface AppState<T = () => ResourceItem[] | undefined> {
  resources: T;
  getRelated: (barn: Barn) => Promise<Barn[]>;
  loading: () => boolean;
}
