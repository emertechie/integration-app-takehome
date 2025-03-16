import { Integration } from "@integration-app/react";

export interface PendingResult {
  status: "pending";
  integration: Integration;
}

export interface SuccessResult {
  status: "success";
  integration: Integration;
  contact: {
    id: string;
    uri: string;
  };
}

export interface ErrorResult {
  status: "error";
  integration: Integration;
  error: {
    message: string;
  };
}

export type ContactResult = SuccessResult | PendingResult | ErrorResult;
