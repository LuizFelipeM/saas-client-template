import { FeatureType } from "@/lib/prisma";

export interface Feature {
  type: FeatureType;
  metadata?: FeatureMetadata;
}

export interface FeatureMetadata {
  min?: number;
  max?: number;
}

export interface FeatureUsage {
  value: number;
  timestamp: Date;
}
