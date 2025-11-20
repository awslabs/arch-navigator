/**
 * @repo/api - Resource Management via BARN
 *
 * Provides a normalized interface for working with resources through
 * BARN - a type:identifier format that bridges CloudFormation
 * and CCAPI.
 *
 * @example
 * ```ts
 * import { parseArn, getDetails, getRelated } from '@repo/api';
 *
 * // Parse an ARN into BARN format
 * const barn = parseArn('arn:aws:s3:::my-bucket');
 *
 * // Get resource details from CCAPI
 * const details = await getDetails(barn);
 *
 * // Find related resources
 * const related = await getRelated(barn);
 * ```
 */

export {
  getDetails,
  getRelated,
  initializeApi,
  listResources,
} from "./api";
export {
  formatBarnIdentifier,
  formatBarnType,
  fromBarn,
  toBarn,
  serviceFromBarn,
} from "./barn";
export type { AWSCredentials } from "./credentials";
export { isElectron, loadElectronCredentials } from "./electron-credentials";
export type { AppState, ResourceItem } from "./state";
export { BarnSchema } from "./types";
export type { Barn, ResourceDetails } from "./types";
export { createBarn, parseArn } from "./utils/arn-parser";
export {
  classifyResource,
  classifyService,
  EResourceClassification,
} from "./utils/resourceUtil";
