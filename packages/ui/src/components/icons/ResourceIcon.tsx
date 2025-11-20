import {
  type Barn,
  classifyResource,
  EResourceClassification,
  serviceFromBarn,
} from "@repo/api";
import {
  Asterisk,
  Box,
  Brain,
  ChartLine,
  ChartPie,
  Cloud,
  Cog,
  Cpu,
  Database,
  FileLock2,
  FileSearch,
  FolderKanban,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  Logs,
  Mail,
  MessagesSquare,
  Network,
  Router,
  Search,
  Server,
  ServerCog,
  Shield,
  Tag,
  Timer,
  Users,
  Webhook,
} from "lucide-solid";
import type { JSX } from "solid-js";
import { createMemo } from "solid-js";
import { SymlinkIcon } from "./SymlinkIcon";
import type { IIconProps } from "./types";

export const ResourceIcon = (props: {
  resource: Barn;
  options?: IIconProps;
}) => {
  const icon = createMemo(() => iconForResource(props.resource, props.options));
  return <>{icon()}</>;
};

export const iconForResource = (
  resource: Barn,
  options: IIconProps = {},
): JSX.Element => {
  const resourceIcon = iconForResourceImpl(resource, options);

  return options.isSymLink ? (
    <SymlinkIcon primaryIcon={resourceIcon} />
  ) : (
    resourceIcon
  );
};

const iconForResourceImpl = (resource: Barn, options: IIconProps) => {
  const {
    variant = "default",
    size = 20,
    className = "tw-text-muted-foreground",
  } = options;

  const iconProps: IIconProps = { variant, size, className };

  const service = serviceFromBarn(resource);

  // First check for specific service icons
  switch (service) {
    // Storage services
    case "s3":
    case "s3-glacier":
    case "s3-outposts":
      return <HardDrive {...iconProps} />;
    case "ebs":
      return <HardDrive {...iconProps} />;
    case "efs":
      return <HardDrive {...iconProps} />;
    case "glacier":
      return <HardDrive {...iconProps} />;
    case "fsx":
      return <HardDrive {...iconProps} />;
    case "backup":
      return <HardDrive {...iconProps} />;
    case "storage-gateway":
      return <HardDrive {...iconProps} />;

    // Compute services
    case "lambda":
      return <Server {...iconProps} />;
    case "ec2":
      return <Server {...iconProps} />;
    case "ecs":
      return <Layers {...iconProps} />;
    case "eks":
      return <Layers {...iconProps} />;
    case "ecr":
    case "ecr-public":
      return <Layers {...iconProps} />;
    case "fargate":
      return <Layers {...iconProps} />;
    case "batch":
      return <Timer {...iconProps} />;
    case "lightsail":
      return <Cloud {...iconProps} />;
    case "elastic-inference":
      return <Cpu {...iconProps} />;
    case "elasticbeanstalk":
      return <Cloud {...iconProps} />;
    case "apprunner":
      return <Server {...iconProps} />;
    case "serverless-application-repository":
      return <FolderKanban {...iconProps} />;
    case "outposts":
      return <Server {...iconProps} />;
    case "snow":
    case "snowball":
      return <Server {...iconProps} />;
    case "autoscaling":
    case "autoscaling-plans":
      return <Layers {...iconProps} />;

    // Database services
    case "dynamodb":
    case "ddb":
      return <Database {...iconProps} />;
    case "rds":
    case "aurora":
      return <Database {...iconProps} />;
    case "elasticache":
      return <Database {...iconProps} />;
    case "memorydb":
      return <Database {...iconProps} />;
    case "neptune":
      return <Database {...iconProps} />;
    case "timestream":
      return <Database {...iconProps} />;
    case "documentdb":
      return <Database {...iconProps} />;
    case "dax":
      return <Database {...iconProps} />;
    case "keyspaces":
      return <Database {...iconProps} />;
    case "qldb":
      return <Database {...iconProps} />;
    case "redshift":
      return <Database {...iconProps} />;

    // Network services
    case "apigateway":
    case "apigatewayv2":
      return <Webhook {...iconProps} />;
    case "appsync":
      return <Webhook {...iconProps} />;
    case "cloudfront":
      return <Globe {...iconProps} />;
    case "route53":
    case "route53-domains":
    case "route53-resolver":
      return <Globe {...iconProps} />;
    case "vpc":
    case "vpc-lattice":
      return <Network {...iconProps} />;
    case "elb":
    case "elasticloadbalancing":
      return <Router {...iconProps} />;
    case "webappfirewall":
    case "waf":
      return <Shield {...iconProps} />;
    case "directconnect":
      return <Network {...iconProps} />;
    case "globalaccelerator":
      return <Network {...iconProps} />;
    case "privatelink":
      return <Network {...iconProps} />;
    case "appmesh":
      return <Network {...iconProps} />;

    // Identity & Security services
    case "iam":
      return <FileLock2 {...iconProps} />;
    case "cognito":
    case "cognito-identity":
    case "cognito-idp":
      return <Users {...iconProps} />;
    case "kms":
      return <KeyRound {...iconProps} />;
    case "secretsmanager":
      return <Lock {...iconProps} />;
    case "fraud-detector":
      return <Shield {...iconProps} />;
    case "acm":
      return <Lock {...iconProps} />;
    case "artifact":
      return <FileLock2 {...iconProps} />;
    case "detective":
      return <Search {...iconProps} />;
    case "directory-service":
      return <Users {...iconProps} />;
    case "guardduty":
      return <Shield {...iconProps} />;
    case "inspector":
    case "inspector2":
      return <Search {...iconProps} />;
    case "macie":
      return <Shield {...iconProps} />;
    case "ram":
      return <Users {...iconProps} />;
    case "securityhub":
      return <Shield {...iconProps} />;
    case "shield":
      return <Shield {...iconProps} />;
    case "sso":
      return <Users {...iconProps} />;

    // Analytics services
    case "athena":
      return <FileSearch {...iconProps} />;
    case "emr":
      return <ChartPie {...iconProps} />;
    case "kinesis":
    case "kinesis-analytics":
    case "kinesis-video-streams":
      return <ChartLine {...iconProps} />;
    case "firehose":
    case "kinesis-firehose":
      return <ChartLine {...iconProps} />;
    case "glue":
      return <ChartPie {...iconProps} />;
    case "quicksight":
      return <LayoutDashboard {...iconProps} />;
    case "cloudsearch":
      return <Search {...iconProps} />;
    case "datazone":
      return <Database {...iconProps} />;
    case "finspace":
      return <ChartLine {...iconProps} />;
    case "lakeformation":
      return <Database {...iconProps} />;
    case "msk":
      return <ChartLine {...iconProps} />;
    case "opensearch":
    case "es":
      return <Search {...iconProps} />;

    // Machine Learning services
    case "lex":
      return <MessagesSquare {...iconProps} />;
    case "sagemaker":
      return <Brain {...iconProps} />;
    case "comprehend":
      return <Brain {...iconProps} />;
    case "rekognition":
      return <Brain {...iconProps} />;
    case "bedrock":
      return <Brain {...iconProps} />;
    case "forecast":
      return <ChartLine {...iconProps} />;
    case "kendra":
      return <Search {...iconProps} />;
    case "lookoutvision":
    case "lookoutequipment":
    case "lookoutmetrics":
      return <Brain {...iconProps} />;
    case "personalize":
      return <Brain {...iconProps} />;
    case "polly":
      return <MessagesSquare {...iconProps} />;
    case "textract":
      return <FileSearch {...iconProps} />;
    case "transcribe":
      return <MessagesSquare {...iconProps} />;
    case "translate":
      return <MessagesSquare {...iconProps} />;

    // Monitoring & Management services
    case "logs":
    case "cloudwatch":
      return <Logs {...iconProps} />;
    case "cloudtrail":
      return <Logs {...iconProps} />;
    case "xray":
      return <Search {...iconProps} />;
    case "config":
      return <Cog {...iconProps} />;
    case "controltower":
      return <ServerCog {...iconProps} />;
    case "health":
      return <Logs {...iconProps} />;
    case "license-manager":
      return <FileLock2 {...iconProps} />;
    case "organizations":
      return <FolderKanban {...iconProps} />;
    case "trusted-advisor":
      return <Cog {...iconProps} />;
    case "wellarchitected":
      return <Cog {...iconProps} />;
    case "appconfig":
      return <Cog {...iconProps} />;

    // Developer Tools
    case "cloud9":
      return <Cpu {...iconProps} />;
    case "cloudshell":
      return <Cpu {...iconProps} />;
    case "codebuild":
      return <Cpu {...iconProps} />;
    case "codecommit":
      return <Cpu {...iconProps} />;
    case "codedeploy":
      return <Cpu {...iconProps} />;
    case "codepipeline":
      return <Cpu {...iconProps} />;
    case "codestar":
      return <Cpu {...iconProps} />;
    case "codeartifact":
      return <Cpu {...iconProps} />;

    // Integration & Messaging services
    case "sns":
      return <Mail {...iconProps} />;
    case "sqs":
      return <Mail {...iconProps} />;
    case "step-functions":
    case "states":
      return <Layers {...iconProps} />;
    case "swf":
      return <Layers {...iconProps} />;
    case "appflow":
      return <Webhook {...iconProps} />;
    case "mq":
      return <Mail {...iconProps} />;

    // Core services
    case "cloudformation":
      return <Layers {...iconProps} />;
    case "events":
    case "eventbridge":
      return <Timer {...iconProps} />;
    case "resource-explorer-2":
      return <Search {...iconProps} />;
    case "resource-groups":
      return <FolderKanban {...iconProps} />;
    case "servicecatalog":
      return <FolderKanban {...iconProps} />;
    case "ssm":
      return <Cog {...iconProps} />;
    case "tags":
      return <Tag {...iconProps} />;
    case "applications":
      return <ServerCog {...iconProps} />;

    // Media services
    case "elastic-transcoder":
      return <Cpu {...iconProps} />;
    case "elemental-mediaconvert":
    case "elemental-medialive":
    case "elemental-mediapackage":
    case "elemental-mediastore":
      return <Cpu {...iconProps} />;

    // Business Applications
    case "chime":
      return <MessagesSquare {...iconProps} />;
    case "connect":
      return <MessagesSquare {...iconProps} />;
    case "pinpoint":
      return <Mail {...iconProps} />;
    case "ses":
      return <Mail {...iconProps} />;
    case "workdocs":
      return <FileSearch {...iconProps} />;
    case "workmail":
      return <Mail {...iconProps} />;
    case "workspaces":
      return <Cpu {...iconProps} />;

    // End User Computing
    case "appstream":
      return <Cpu {...iconProps} />;
    case "worklink":
      return <Globe {...iconProps} />;

    // IoT services
    case "iot":
    case "iot-analytics":
    case "iot-events":
    case "iot-greengrass":
    case "iot-sitewise":
    case "iot-things-graph":
      return <Cpu {...iconProps} />;

    // Migration & Transfer
    case "application-discovery":
      return <Search {...iconProps} />;
    case "database-migration-service":
    case "dms":
      return <Database {...iconProps} />;
    case "datasync":
      return <HardDrive {...iconProps} />;
    case "migration-hub":
      return <FolderKanban {...iconProps} />;
    case "transfer":
      return <HardDrive {...iconProps} />;

    // Blockchain
    case "managed-blockchain":
      return <Database {...iconProps} />;

    // Satellite
    case "groundstation":
      return <Globe {...iconProps} />;

    // Quantum Computing
    case "braket":
      return <Cpu {...iconProps} />;

    // Robotics
    case "robomaker":
      return <Cpu {...iconProps} />;

    default:
    // fall through to resource type classification
  }

  // If no specific service icon, use resource type classification
  switch (classifyResource(resource)) {
    case EResourceClassification.STORAGE:
      return <HardDrive {...iconProps} />;
    case EResourceClassification.DATABASE:
      return <Database {...iconProps} />;
    case EResourceClassification.COMPUTE:
      return <Cpu {...iconProps} />;
    case EResourceClassification.IDENTITY:
      return <FileLock2 {...iconProps} />;
    case EResourceClassification.NETWORK:
      return <Network {...iconProps} />;
    case EResourceClassification.MONITORING:
      return <Logs {...iconProps} />;
    case EResourceClassification.CORE:
      return <FolderKanban {...iconProps} />;
    case EResourceClassification.ANALYTICS:
      return <Brain {...iconProps} />;
    case EResourceClassification.MACHINE_LEARNING:
      return <Brain {...iconProps} />;
    case EResourceClassification.SECURITY:
      return <Shield {...iconProps} />;
    case EResourceClassification.UNKNOWN:
      return <Box {...iconProps} />;
    default:
      return <Asterisk {...iconProps} />;
  }
};
