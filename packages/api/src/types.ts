import { z } from "zod";

/**
 * BARN - A normalized representation of resources.
 *
 * Maps CloudFormation type:identifier pairs to enable fluent communication
 * with both CloudFormation and CCAPI. CCAPI returns raw ARNs which are
 * parsed into this format.
 */
export const BarnSchema = z.object({
  /** CloudFormation resource type (e.g., 'AWS::EC2::Instance') */
  type: z.string(),
  /** Resource identifier (e.g., instance ID, bucket name) */
  identifier: z.string(),
  /** Optional raw AWS ARN */
  arn: z.string().optional(),

  account: z.string().optional(),
  region: z.string().optional(),
  prettyName: z.string().optional(),
});

export type IBarn = z.infer<typeof BarnSchema>;

/**
 * Resource properties returned from CCAPI.
 * Contains service-specific fields describing the resource.
 */
export interface ResourceDetails {
  [field: string]: unknown;
}
