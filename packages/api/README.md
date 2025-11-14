# @arch-navigator/api

Cloud resource management using BARN format.

## Overview

BARN provides a normalized way to work with cloud resources across multiple providers. It maps resource types to identifiers, enabling consistent interaction with different cloud APIs.

## Core Concepts

### BARN Structure
```typescript
interface IBarn {
  type: string;        // Resource type (e.g., 'AWS::EC2::Instance', 'Azure::Compute::VirtualMachine')
  identifier: string;  // Resource identifier (e.g., 'i-1234567890abcdef0')
  arn?: string;        // Optional raw resource identifier
}
```

### Currently Supported (AWS)
- **EC2**: Instances, Volumes, Security Groups, VPCs, Subnets
- **IAM**: Roles, Users, Policies
- **S3**: Buckets
- **Lambda**: Functions
- **RDS**: DB Instances, DB Clusters
- **DynamoDB**: Tables
- **SNS**: Topics
- **SQS**: Queues
- **ELB**: Load Balancers (Classic & Application)
- **CloudFormation**: Stacks

## Usage

### Parse Resource Identifier to BARN
```typescript
import { parseArn } from '@arch-navigator/api';

const barn = parseArn('arn:aws:s3:::my-bucket');
// { type: 'AWS::S3::Bucket', identifier: 'my-bucket', arn: '...' }
```

### Create BARN Manually
```typescript
import { createBarn } from '@arch-navigator/api';

const barn = createBarn('AWS::Lambda::Function', 'my-function');
```

### Get Resource Details
```typescript
import { getDetails } from '@arch-navigator/api';

const details = await getDetails(barn);
// Returns resource properties from cloud provider API
```

### Find Related Resources
```typescript
import { getRelated } from '@arch-navigator/api';

const related = await getRelated(barn);
// Returns array of related BARNs
```

## Development Status

- ✅ Resource identifier parsing for AWS services
- ✅ BARN type definitions
- ✅ Cloud provider API integration via AWS Cloud Control API
- ✅ Relationship discovery via ARN parsing
