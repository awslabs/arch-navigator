import type { Barn } from "../types";

/**
 * ARN Parser for AWS Resources
 *
 * Converts AWS ARNs into BARN format for normalized resource handling.
 * Supports the most common resource types across top AWS services.
 */

const ARN_PATTERN = /^arn:aws:([^:]+):([^:]*):([^:]*):(.+)$/;

/**
 * Service-specific parsers that extract CloudFormation type and identifier from ARN resource strings.
 * Each parser handles the resource format conventions for its service.
 */
const SERVICE_MAPPINGS: Record<
  string,
  (resource: string) => { type: string; identifier: string } | null
> = {
  /** EC2: instances, volumes, security groups, VPCs, subnets */
  ec2: (resource) => {
    const [resourceType, id] = resource.split("/");
    if (!resourceType || !id) return null;
    const typeMap: Record<string, string> = {
      instance: "AWS::EC2::Instance",
      volume: "AWS::EC2::Volume",
      "security-group": "AWS::EC2::SecurityGroup",
      vpc: "AWS::EC2::VPC",
      subnet: "AWS::EC2::Subnet",
    };
    return typeMap[resourceType]
      ? { type: typeMap[resourceType], identifier: id }
      : null;
  },
  /** IAM: roles, users, policies */
  iam: (resource) => {
    const [resourceType, ...rest] = resource.split("/");
    const typeMap: Record<string, string> = {
      role: "AWS::IAM::Role",
      user: "AWS::IAM::User",
      policy: "AWS::IAM::Policy",
    };
    const name = rest.join("/");
    return typeMap[resourceType] && name
      ? { type: typeMap[resourceType], identifier: name }
      : null;
  },
  /** S3: buckets */
  s3: (resource) => ({ type: "AWS::S3::Bucket", identifier: resource }),
  /** Lambda: functions */
  lambda: (resource) => {
    const [, name] = resource.split(":");
    return name ? { type: "AWS::Lambda::Function", identifier: name } : null;
  },
  /** RDS: DB instances and clusters */
  rds: (resource) => {
    const [resourceType, id] = resource.split(":");
    const typeMap: Record<string, string> = {
      db: "AWS::RDS::DBInstance",
      cluster: "AWS::RDS::DBCluster",
    };
    return typeMap[resourceType]
      ? { type: typeMap[resourceType], identifier: id }
      : null;
  },
  /** DynamoDB: tables */
  dynamodb: (resource) => {
    const [, name] = resource.split("/");
    return name ? { type: "AWS::DynamoDB::Table", identifier: name } : null;
  },
  /** SNS: topics */
  sns: (resource) => ({
    type: "AWS::SNS::Topic",
    identifier: resource.split(":").pop() || resource,
  }),
  /** SQS: queues */
  sqs: (resource) => ({
    type: "AWS::SQS::Queue",
    identifier: resource.split(":").pop() || resource,
  }),
  /** ELB: classic and application load balancers */
  elasticloadbalancing: (resource) => {
    if (resource.startsWith("loadbalancer/app/")) {
      return {
        type: "AWS::ElasticLoadBalancingV2::LoadBalancer",
        identifier: resource,
      };
    }
    return {
      type: "AWS::ElasticLoadBalancing::LoadBalancer",
      identifier: resource,
    };
  },
  /** CloudFormation: stacks */
  cloudformation: (resource) => {
    const [, name] = resource.split("/");
    return name
      ? { type: "AWS::CloudFormation::Stack", identifier: name }
      : null;
  },
  /** AppSync: GraphQL APIs */
  appsync: (resource) => {
    const [, id] = resource.split("/");
    return id ? { type: "AWS::AppSync::GraphQLApi", identifier: id } : null;
  },
  /** Kinesis: streams */
  kinesis: (resource) => {
    const [, name] = resource.split("/");
    return name ? { type: "AWS::Kinesis::Stream", identifier: name } : null;
  },
  /** SSM: parameters */
  ssm: (resource) => {
    const [, ...parts] = resource.split("/");
    return parts.length > 0
      ? { type: "AWS::SSM::Parameter", identifier: parts.join("/") }
      : null;
  },
  /** KMS: keys */
  kms: (resource) => {
    const [, id] = resource.split("/");
    return id ? { type: "AWS::KMS::Key", identifier: id } : null;
  },
  /** Bedrock: foundation models */
  bedrock: (resource) => {
    return { type: "AWS::Bedrock::FoundationModel", identifier: resource };
  },
  /** CloudWatch Logs: log groups */
  logs: (resource) => {
    const [, name] = resource.split(":");
    // Skip wildcards
    if (!name || name === "*") return null;
    return { type: "AWS::Logs::LogGroup", identifier: name };
  },
  /** Resource Groups: groups */
  "resource-groups": (resource) => {
    const [, name] = resource.split("/");
    return name
      ? { type: "AWS::ResourceGroups::Group", identifier: name }
      : null;
  },
};

/**
 * Parses an AWS ARN into a BARN.
 *
 * @param arn - AWS ARN string (e.g., 'arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0')
 * @returns BARN object with type, identifier, and original ARN, or null if parsing fails
 *
 * @example
 * ```ts
 * const barn = parseArn('arn:aws:s3:::my-bucket');
 * // { type: 'AWS::S3::Bucket', identifier: 'my-bucket', arn: 'arn:aws:s3:::my-bucket' }
 * ```
 */
export function parseArn(arn: string): Barn | null {
  const match = arn.match(ARN_PATTERN);
  if (!match) return null;

  const [, service, , , resource] = match;
  const parser = SERVICE_MAPPINGS[service];
  if (!parser) return null;

  const result = parser(resource);
  return result ? { ...result, arn } : null;
}

/**
 * Creates a BARN from CloudFormation type and identifier.
 *
 * @param type - CloudFormation resource type (e.g., 'AWS::EC2::Instance')
 * @param identifier - Resource identifier (e.g., 'i-1234567890abcdef0')
 * @param arn - Optional raw AWS ARN
 * @returns BARN object
 *
 * @example
 * ```ts
 * const barn = createBarn('AWS::Lambda::Function', 'my-function');
 * // { type: 'AWS::Lambda::Function', identifier: 'my-function' }
 * ```
 */
export function createBarn(
  type: string,
  identifier: string,
  arn?: string,
): Barn {
  return { type, identifier, arn };
}
