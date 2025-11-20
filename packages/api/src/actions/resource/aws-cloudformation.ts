import {
  CloudFormationClient,
  type CloudFormationClientConfig,
  ListStackResourcesCommand,
} from "@aws-sdk/client-cloudformation";
import type { Barn } from "@repo/api";
import type { CredentialedConfig } from "@repo/api/credentials";
import type { ResourceActionSet } from "../types";
import { getGenericDetails } from "./aws-generic";

let configured = false;
let clientConfig: CloudFormationClientConfig = {
  region: "us-east-1",
};

export function configureClient(config: CredentialedConfig) {
  if (!configured) {
    clientConfig = { ...clientConfig, ...config };
    config.credentials;
    configured = true;
  }
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
        return {
          identifier: stackResourceSummary.PhysicalResourceId || "",
          arn: stackResourceSummary.PhysicalResourceId || "",
          prettyName: stackResourceSummary.LogicalResourceId || "",
          type: stackResourceSummary.ResourceType || "",
          region: resource.region || "",
          account: resource.account || "",
        };
      }) || [];

    return barns.sort((a, b) => {
      const aIsStack = a.type === "AWS::CloudFormation::Stack" ? 0 : 1;
      const bIsStack = b.type === "AWS::CloudFormation::Stack" ? 0 : 1;
      if (aIsStack !== bIsStack) return aIsStack - bIsStack;
      if (a.prettyName !== b.prettyName) return (a.prettyName || "").localeCompare(b.prettyName || "");
      return a.type.localeCompare(b.type);
    });
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
