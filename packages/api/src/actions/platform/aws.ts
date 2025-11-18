import {
  CloudControlClient,
  type CloudControlClientConfig,
  ListResourcesCommand,
} from "@aws-sdk/client-cloudcontrol";
import { createBarn, type IBarn } from "@repo/api";
import type { ICredentialedConfig } from "@repo/api/credentials";
import type { IPlatformActionSet } from "../types";

let clientConfig: CloudControlClientConfig = {
  region: "us-east-1",
};

export function configureClient(config: ICredentialedConfig) {
  clientConfig = { ...clientConfig, ...config };
  config.credentials;
}

export const awsActions: IPlatformActionSet = {
  listResources,
};

/**
 * Query options for listing resources.
 * Supports SQL-like filtering and selection (to be implemented).
 */
export interface IListResourcesQuery {
  /** Resource types to filter by (e.g., ['AWS::EC2::Instance', 'AWS::S3::Bucket']) */
  types?: string[];
  /** Field selection (e.g., ['identifier', 'type']) */
  select?: string[];
  /** Filter conditions (to be implemented) */
  where?: Record<string, unknown>;
  /** Maximum number of results */
  limit?: number;
  /** Number of results to skip */
  offset?: number;
}

/**
 * Lists AWS resources with optional filtering and selection.
 *
 * Uses AWS Cloud Control API to query resources across your AWS account.
 *
 * @param query - Optional query parameters for filtering and selection
 * @returns Promise resolving to array of resource BARNs
 *
 * @example
 * ```ts
 * // List all resources
 * const all = await listResources();
 *
 * // List only EC2 instances
 * const instances = await listResources({ types: ['AWS::EC2::Instance'] });
 *
 * // List with limit
 * const limited = await listResources({ limit: 5 });
 * ```
 */
export async function listResources(
  query?: ListResourcesQuery,
): Promise<IBarn[]> {
  const client = new CloudControlClient(clientConfig);
  const types = query?.types || ["AWS::CloudFormation::Stack"];
  const allResources: IBarn[] = [];

  for (const type of types) {
    try {
      const command = new ListResourcesCommand({ TypeName: type });
      const response = await client.send(command);

      if (response.ResourceDescriptions) {
        for (const desc of response.ResourceDescriptions) {
          if (desc.Identifier && desc.Properties) {
            const props = JSON.parse(desc.Properties);
            // Skip nested stacks (they have a ParentId property)
            if (type === "AWS::CloudFormation::Stack" && props.ParentId) {
              continue;
            }
            allResources.push(createBarn(type, desc.Identifier));
          }
        }
      }
    } catch (error) {
      console.error(`Failed to list ${type}:`, error);
      // Re-throw auth errors
      if (
        error instanceof Error &&
        error.name === "UnrecognizedClientException"
      ) {
        throw error;
      }
    }
  }

  let resources = allResources;
  if (query?.offset) {
    resources = resources.slice(query.offset);
  }
  if (query?.limit) {
    resources = resources.slice(0, query.limit);
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return resources;
}
