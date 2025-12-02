import type { CloudControlClientConfig } from "@aws-sdk/client-cloudcontrol";
import {
  configureClient as configureAwsClient,
  getCallerIdentity,
  listResources as listAwsResources,
  type ListResourcesQuery,
} from "./actions/platform/aws";
import { resourceActions } from "./actions/resource";
import { configureClient as configureAwsCloudFormationResourceClient } from "./actions/resource/aws-cloudformation";
import { configureClient as configureGenericResourceClient } from "./actions/resource/aws-generic";
import type { CredentialedConfig } from "./credentials";
import type { Barn } from "./types";

let clientConfig: CloudControlClientConfig = {
  region: "us-east-1",
};

function configureThisClient(config: CredentialedConfig) {
  clientConfig = { ...clientConfig, ...config };
}

export async function initializeApi(config: CredentialedConfig) {
  configureThisClient(config);
  configureAwsClient(config);
  configureGenericResourceClient(config);
  configureAwsCloudFormationResourceClient(config);
}

export async function listResources(
  query?: ListResourcesQuery,
): Promise<Barn[]> {
  return listAwsResources(query);
}

export async function getDetails(resource: Barn) {
  return resourceActions.getDetails(resource);
}

export async function getRelated(resource: Barn) {
  return resourceActions.getRelated(resource);
}

export { getCallerIdentity };
