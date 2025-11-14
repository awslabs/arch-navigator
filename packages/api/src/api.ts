import {
  CloudControlClient,
  type CloudControlClientConfig,
  ListResourcesCommand,
} from "@aws-sdk/client-cloudcontrol";
import { createBarn, parseArn } from "./arn-parser";
import type { IBarn, ResourceDetails } from "./types";

const UNSUPPORTED_TYPES = new Set([
  "AWS::IAM::Policy", // CloudControl doesn't support READ
]);

let clientConfig: CloudControlClientConfig = {
  region: "us-east-1",
};

export function configureClient(config: CloudControlClientConfig) {
  clientConfig = { ...clientConfig, ...config };
}

/**
 * Query options for listing resources.
 * Supports SQL-like filtering and selection (to be implemented).
 */
export interface ListResourcesQuery {
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

/**
 * Retrieves detailed properties for an AWS resource from Cloud Control API.
 *
 * @param resource - BARN identifying the resource
 * @returns Promise resolving to resource properties as returned by Cloud Control API
 *
 * @example
 * ```ts
 * const barn = createBarn('AWS::S3::Bucket', 'my-bucket');
 * const details = await getDetails(barn);
 * // { BucketName: 'my-bucket', CreationDate: '2024-01-01T00:00:00Z', ... }
 * ```
 */
export async function getDetails(resource: IBarn): Promise<ResourceDetails> {
  // Handle unsupported types
  if (UNSUPPORTED_TYPES.has(resource.type)) {
    return {
      Message: `CloudControl API does not support READ for ${resource.type}`,
      ResourceType: resource.type,
      Identifier: resource.identifier,
    };
  }

  const client = new CloudControlClient(clientConfig);

  try {
    const { GetResourceCommand } = await import("@aws-sdk/client-cloudcontrol");
    const command = new GetResourceCommand({
      TypeName: resource.type,
      Identifier: resource.identifier,
    });
    const response = await client.send(command);

    if (response.ResourceDescription?.Properties) {
      return JSON.parse(response.ResourceDescription.Properties);
    }

    throw new Error(`No properties found for resource: ${resource.identifier}`);
  } catch (error) {
    console.error(`Failed to get details for ${resource.identifier}:`, error);
    throw error;
  }
}

/**
 * Discovers related AWS resources for a given resource.
 *
 * Returns resources that have relationships with the input resource,
 * such as security groups attached to an EC2 instance, or Lambda functions
 * triggered by an SNS topic. Relationships are discovered by parsing ARNs
 * from the resource's properties.
 *
 * @param resource - BARN identifying the resource
 * @returns Promise resolving to array of related resource BARNs
 *
 * @example
 * ```ts
 * const barn = createBarn('AWS::EC2::Instance', 'i-1234567890abcdef0');
 * const related = await getRelated(barn);
 * // [
 * //   { type: 'AWS::EC2::SecurityGroup', identifier: 'sg-12345' },
 * //   { type: 'AWS::EC2::Volume', identifier: 'vol-67890' }
 * // ]
 * ```
 */
export async function getRelated(resource: IBarn): Promise<IBarn[]> {
  try {
    const details = await getDetails(resource);
    const arns = extractArns(details);

    console.log(`Found ${arns.length} ARNs in ${resource.identifier}`);

    const parsed: IBarn[] = [];
    const failed: string[] = [];

    arns.forEach((arn) => {
      const barn = parseArn(arn);
      if (barn) {
        parsed.push(barn);
      } else {
        failed.push(arn);
      }
    });

    const successRate =
      arns.length > 0 ? ((parsed.length / arns.length) * 100).toFixed(1) : "0";

    console.log(
      `Parsed ${parsed.length}/${arns.length} ARNs (${successRate}% success)`,
    );

    if (failed.length > 0) {
      console.log("Failed to parse ARNs:", failed);
    }

    return parsed;
  } catch (error) {
    console.error(
      `Failed to get related resources for ${resource.identifier}:`,
      error,
    );
    return [];
  }
}

function extractArns(obj: unknown): string[] {
  const arnSet = new Set<string>();
  const arnPattern = /^arn:aws:[^:]+:[^:]*:[^:]*:.+$/;

  function traverse(value: unknown) {
    if (typeof value === "string" && arnPattern.test(value)) {
      // Skip template variables
      if (!value.includes("${")) {
        arnSet.add(value);
      }
    } else if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(traverse);
    }
  }

  traverse(obj);
  return Array.from(arnSet);
}
