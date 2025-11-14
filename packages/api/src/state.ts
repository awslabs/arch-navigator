import type { IBarn, ResourceDetails } from "./types";

export interface ResourceItem {
  barn: IBarn;
  details: ResourceDetails;
}

export interface AppState<T = () => ResourceItem[] | undefined> {
  resources: T;
  getRelated: (barn: IBarn) => Promise<IBarn[]>;
  loading: () => boolean;
}
