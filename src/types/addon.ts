import { FeatureType } from "@/lib/prisma";

export interface AddonMetadata {
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
}

export interface AddonValue {
  enabled?: boolean;
  quantity?: number;
  customValue?: any;
}

export interface Addon {
  id: string;
  name: string;
  description?: string;
  stripeProductId: string;
  featureKey: string;
  featureType: FeatureType;
  metadata?: AddonMetadata;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionAddon {
  id: string;
  value: AddonValue;
  createdAt: Date;
  updatedAt: Date;
  addon: Addon;
}

export interface CreateAddonInput {
  name: string;
  description?: string;
  stripeProductId: string;
  featureKey: string;
  featureType: FeatureType;
  metadata?: AddonMetadata;
}

export interface UpdateAddonInput {
  name?: string;
  description?: string;
  isActive?: boolean;
  metadata?: AddonMetadata;
}

export interface ConfigureAddonInput {
  subscriptionId: string;
  addonId: string;
  value: AddonValue;
}
