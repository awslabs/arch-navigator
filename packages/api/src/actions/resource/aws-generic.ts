import {
  CloudControlClient,
  type CloudControlClientConfig,
} from "@aws-sdk/client-cloudcontrol";
import { type Barn, parseArn, type ResourceDetails } from "@repo/api";
import type { CredentialedConfig } from "@repo/api/credentials";
import { extractArns } from "@repo/api/utils/arnUtil";
import { type ResourceActionSet, UNSUPPORTED_TYPES } from "../types";

let clientConfig: CloudControlClientConfig = {
  region: "us-east-1",
};

export function configureClient(config: CredentialedConfig) {
  clientConfig = { ...clientConfig, ...config };
  config.credentials;
}

export const genericActions: ResourceActionSet = {
  getDetails: getGenericDetails,
  getRelated: getGenericRelated,
};

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
export async function getGenericDetails(
  resource: Barn,
): Promise<ResourceDetails> {
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
export async function getGenericRelated(resource: Barn): Promise<Barn[]> {
  try {
    const details = await getGenericDetails(resource);
    const arns = extractArns(details);

    console.log(`Found ${arns.length} ARNs in ${resource.identifier}`);

    const parsed: Barn[] = [];
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
