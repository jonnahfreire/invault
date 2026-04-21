declare namespace Express {
  export interface Request {
    idempotencyKey: string;
    correlationId: string;
    requestHash: string;
    user: {
      id: string;
      name: string;
      type?: "user" | "application";
      email?: string;
      applicationId?: string;
    };
  }
}
