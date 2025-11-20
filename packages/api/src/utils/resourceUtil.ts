import { serviceFromBarn } from "../barn";
import type { Barn } from "../types";

export enum EResourceClassification {
  STORAGE = "STORAGE",
  DATABASE = "DATABASE",
  COMPUTE = "COMPUTE",
  IDENTITY = "IDENTITY",
  MONITORING = "MONITORING",
  CORE = "CORE",
  SECURITY = "SECURITY",
  NETWORK = "NETWORK",
  UNKNOWN = "UNKNOWN",
  ANALYTICS = "ANALYTICS",
  MACHINE_LEARNING = "MACHINE_LEARNING",
}

export const classifyResource = (resource: Barn): EResourceClassification =>
  classifyService(serviceFromBarn(resource));

export const classifyService = (service: string): EResourceClassification => {
  // console.log("classify-service", service);
  switch (service) {
    case "firehose":
      return EResourceClassification.ANALYTICS;
    case "lex":
      return EResourceClassification.MACHINE_LEARNING;
    case "ec2":
    case "ecs":
    case "elasticloadbalancing":
    case "fargate":
      return EResourceClassification.COMPUTE;
    case "ebs":
    case "es":
    case "lambda":
    case "s3":
    case "sns":
      return EResourceClassification.STORAGE;
    case "appsync":
    case "athena":
    case "cloudtrail":
    case "ddb":
    case "dynamodb":
    case "elasticache":
    case "memorydb":
    case "rds":
      return EResourceClassification.DATABASE;
    case "cognito":
    case "cognito-identity":
    case "cognito-idp":
    case "fraud-detector":
    case "iam":
    case "kms":
      return EResourceClassification.IDENTITY;
    case "apigateway":
    case "cloudfront":
    case "route53":
    case "vpc":
    case "webappfirewall":
      return EResourceClassification.NETWORK;
    case "logs":
      return EResourceClassification.MONITORING;
    case "cloudformation":
    case "events":
    case "resource-explorer-2":
    case "resource-groups":
    case "servicecatalog":
    case "ssm":
    case "tags":
      return EResourceClassification.CORE;
    case "detective":
      return EResourceClassification.SECURITY;
    default:
      return EResourceClassification.UNKNOWN;
  }
};
