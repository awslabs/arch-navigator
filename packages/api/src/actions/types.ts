import type { Barn, ResourceDetails } from "../types";

export interface ResourceActionSet {
  getDetails: (resource: Barn) => Promise<ResourceDetails>;
  getRelated: (resource: Barn) => Promise<Barn[]>;
}

export const UNSUPPORTED_TYPES = new Set([
  "AWS::IAM::Policy", // CloudControl doesn't support READ
]);

export interface PlatformActionSet {
  listResources: (query: ListResourcesQuery) => Promise<Barn[]>;
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
