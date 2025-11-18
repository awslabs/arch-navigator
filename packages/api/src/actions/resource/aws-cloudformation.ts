import {
  CloudFormationClient,
  type CloudFormationClientConfig,
  ListStackResourcesCommand,
} from "@aws-sdk/client-cloudformation";
import type { Barn } from "@repo/api";
import type { CredentialedConfig } from "@repo/api/credentials";
import type { ResourceActionSet } from "../types";
import { getGenericDetails } from "./aws-generic";

let clientConfig: CloudFormationClientConfig = {
  region: "us-east-1",
};

export function configureClient(config: CredentialedConfig) {
  clientConfig = { ...clientConfig, ...config };
  config.credentials;
}

const getRelated: ResourceActionSet["getRelated"] = async (resource) => {
  try {
    const client = new CloudFormationClient(clientConfig);

    const command = new ListStackResourcesCommand({
      StackName: resource.identifier,
    });
    const response = await client.send(command);

    const barns =
      response.StackResourceSummaries?.map<Barn>((stackResourceSummary) => {
        console.log(resource);
        return {
          identifier: stackResourceSummary.PhysicalResourceId || "",
          arn: stackResourceSummary.PhysicalResourceId || "",
          name: stackResourceSummary.LogicalResourceId || "",
          type: stackResourceSummary.ResourceType || "",
          region: resource.region || "",
          account: resource.account || "",
        };
      }) || [];

    return barns;
  } catch (error) {
    console.error(
      `Failed to get related resources for ${resource.identifier}:`,
      error,
    );
    return [];
  }
};

export const awsCloudformationActions: ResourceActionSet = {
  getDetails: getGenericDetails,
  getRelated,
};
