export interface CredentialedConfig {
  credentials: AWSCredentials;
}

export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}
