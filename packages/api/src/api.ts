import type { CloudControlClientConfig } from "@aws-sdk/client-cloudcontrol";
import {
  configureClient as configureAwsClient,
  type ListResourcesQuery,
  listResources as listAwsResources,
} from "./actions/platform/aws";
import {
  awsCloudformationActions,
  configureClient as configureAwsCloudFormationResourceClient,
} from "./actions/resource/aws-cloudformation";
import {
  configureClient as configureGenericResourceClient,
  genericActions,
} from "./actions/resource/aws-generic";

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
  configureGenericResourceClient(config);
  configureAwsClient(config);
  configureAwsCloudFormationResourceClient(config);
}

export async function listResources(
  query?: ListResourcesQuery,
): Promise<Barn[]> {
  return listAwsResources(query);
}

export async function getDetails(resource: Barn) {
  return genericActions.getDetails(resource);
}

export async function getRelated(resource: Barn) {
  switch (resource.type) {
    case "AWS::CloudFormation::Stack":
      return awsCloudformationActions.getRelated(resource);
    default:
      return genericActions.getRelated(resource);
  }
}
