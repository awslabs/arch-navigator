import type { CloudControlClientConfig } from "@aws-sdk/client-cloudcontrol";
import {
  configureClient as configureAwsClient,
  type IListResourcesQuery,
  listResources as listAwsResources,
} from "./actions/platform/aws";
import {
  configureClient as configureGenericResourceClient,
  genericActions,
} from "./actions/resource/generic";
import type { ICredentialedConfig } from "./credentials";
import type { IBarn } from "./types";

let clientConfig: CloudControlClientConfig = {
  region: "us-east-1",
};

function configureThisClient(config: ICredentialedConfig) {
  clientConfig = { ...clientConfig, ...config };
}

export async function initializeApi(config: ICredentialedConfig) {
  configureThisClient(config);
  configureGenericResourceClient(config);
  configureAwsClient(config);
}

export async function listResources(
  query?: IListResourcesQuery,
): Promise<IBarn[]> {
  return listAwsResources(query);
}

export async function getDetails(resource: IBarn) {
  return genericActions.getDetails(resource);
}

export async function getRelated(resource: IBarn) {
  return genericActions.getRelated(resource);
}
