import type { Barn } from "./types";

const BARN_PREFIX = "barn://";

export const fromBarn = (barnStr: string): Barn => {
  // Parse barn://account/region/resourceType/identifier using a single regex
  if (!barnStr) {
    throw new Error(`Invalid BARN format: ${barnStr}`);
  }

  const regex = /^barn:\/\/([^/]*)\/([^/]*)\/([^/]+)\/(.+)$/;
  const match = barnStr.match(regex);

  if (!match) {
    throw new Error(`Invalid BARN format: ${barnStr}`);
  }

  const [, account, region, type, identifier] = match;

  return {
    account: account || undefined, // Convert empty string to undefined
    region: region || undefined, // Convert empty string to undefined
    type,
    identifier,
  };
};

export const toBarn = (resource: Barn): string => {
  return (
    BARN_PREFIX +
    `${resource.account || ""}` +
    `/${resource.region || ""}` +
    `/${resource.type}` +
    `/${resource.identifier}`
  );
};

/**
 * Format a BARN identifier for display
 */
export function formatBarnIdentifier(barn: Barn): string {
  // CloudFormation stacks: extract stack name from ARN
  // Example: arn:aws:cloudformation:us-east-1:123456789012:stack/workload-discovery/f2530ed0-714f-11f0-9e65-0e7bab51d2d3
  if (barn.type === "AWS::CloudFormation::Stack") {
    const match = barn.identifier.match(/:stack\/([^/]+)\//);
    return match ? match[1] : barn.identifier;
  }

  return barn.identifier;
}

/**
 * Format a BARN type for display (removes AWS:: prefix)
 */
export function formatBarnType(type: string): string {
  return type;
  // return type.replace(/^AWS::/, "");
}

export const serviceFromBarn = (barn: Barn): string =>
  barn.type.split("::")[1].toLowerCase();
