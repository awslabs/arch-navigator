import type { Barn } from "@repo/api";
import type { ResourceActionSet } from "../types";
import { awsCloudformationActions } from "./aws-cloudformation";
import { genericActions } from "./aws-generic";

export const resourceActions: ResourceActionSet = {
  getDetails: (resource) =>
    getActionsForResource(resource).getDetails(resource),
  getRelated: (resource) =>
    getActionsForResource(resource).getRelated(resource),
};

const getActionsForResource = (resource: Barn): ResourceActionSet => {
  switch (resource.type) {
    case "AWS::CloudFormation::Stack":
      return awsCloudformationActions;
    default:
      return genericActions;
  }
};
