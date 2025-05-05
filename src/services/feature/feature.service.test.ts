import { FeatureType } from "@/lib/prisma";
import { Feature } from "@/types/feature";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FeatureService } from "../feature/feature.service";

// Mock the Prisma types for testing
type MockPlan = {
  features: Record<string, Feature>;
};

type MockAddon = {
  key: string;
  feature: Feature;
};

// Mock the utils module
vi.mock("@/lib/utils", () => ({
  hasDuplicates: vi
    .fn()
    .mockImplementation((array: any[]) => new Set(array).size !== array.length),
}));

describe("FeatureService", () => {
  let featureService: FeatureService;

  beforeEach(() => {
    featureService = new FeatureService();
    vi.clearAllMocks();
  });

  describe("generateSubscriptionFeatures", () => {
    it("should throw an error if addons have duplicate keys", () => {
      // Arrange
      const plan = {
        features: {
          feature1: { type: "DEFAULT" as FeatureType },
        },
      } as unknown as MockPlan;

      const addons = [
        { key: "addon1", feature: { type: "DEFAULT" as FeatureType } },
        { key: "addon1", feature: { type: "USAGE" as FeatureType } },
      ] as unknown as MockAddon[];

      // Act & Assert
      expect(() =>
        featureService.generateSubscriptionFeatures(plan as any, addons as any)
      ).toThrow(
        "Only one addon of the same feature is allowed to be added, please remove the duplicate addon"
      );
    });

    it("should merge plan features with addon features", () => {
      // Arrange
      const plan = {
        features: {
          feature1: { type: "DEFAULT" as FeatureType },
          feature2: {
            type: "METERED" as FeatureType,
            metadata: { min: 10, max: 100 },
          },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "addon1",
          feature: { type: "DEFAULT" as FeatureType },
        },
        {
          key: "addon2",
          feature: { type: "USAGE" as FeatureType },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: { type: "DEFAULT" },
        feature2: { type: "METERED", metadata: { min: 10, max: 100 } },
        addon1: { type: "DEFAULT" },
        addon2: { type: "USAGE" },
      });
    });

    it("should add METERED feature values when both plan and addon have the same METERED feature", () => {
      // Arrange
      const plan = {
        features: {
          feature1: {
            type: "METERED" as FeatureType,
            metadata: { min: 10, max: 100 },
          },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "feature1",
          feature: {
            type: "METERED" as FeatureType,
            metadata: { min: 5, max: 50 },
          },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: {
          type: "METERED",
          metadata: { min: 15, max: 150 },
        },
      });
    });

    it("should handle null or undefined metadata values correctly", () => {
      // Arrange
      const plan = {
        features: {
          feature1: {
            type: "METERED" as FeatureType,
            metadata: { min: null, max: 100 },
          },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "feature1",
          feature: {
            type: "METERED" as FeatureType,
            metadata: { min: 5 },
          },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: {
          type: "METERED",
          metadata: { min: 5, max: 100 },
        },
      });
    });

    it("should handle negative metadata values and convert them to 0", () => {
      // Arrange
      const plan = {
        features: {
          feature1: {
            type: "METERED" as FeatureType,
            metadata: { min: -10, max: 100 },
          },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "feature1",
          feature: {
            type: "METERED" as FeatureType,
            metadata: { min: -5, max: 50 },
          },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: {
          type: "METERED",
          metadata: { min: 0, max: 150 },
        },
      });
    });

    it("should use addon feature when plan doesn't have the feature", () => {
      // Arrange
      const plan = {
        features: {
          feature1: { type: "DEFAULT" as FeatureType },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "feature2",
          feature: {
            type: "METERED" as FeatureType,
            metadata: { min: 5, max: 50 },
          },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: { type: "DEFAULT" },
        feature2: {
          type: "METERED",
          metadata: { min: 5, max: 50 },
        },
      });
    });

    it("should use addon feature when plan has the feature with a different type", () => {
      // Arrange
      const plan = {
        features: {
          feature1: { type: "DEFAULT" as FeatureType },
        },
      } as unknown as MockPlan;

      const addons = [
        {
          key: "feature1",
          feature: {
            type: "METERED" as FeatureType,
            metadata: { min: 5, max: 50 },
          },
        },
      ] as unknown as MockAddon[];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: {
          type: "METERED",
          metadata: { min: 5, max: 50 },
        },
      });
    });

    it("should handle empty addons array", () => {
      // Arrange
      const plan = {
        features: {
          feature1: { type: "DEFAULT" as FeatureType },
          feature2: {
            type: "METERED" as FeatureType,
            metadata: { min: 10, max: 100 },
          },
        },
      } as unknown as MockPlan;

      const addons: MockAddon[] = [];

      // Act
      const result = featureService.generateSubscriptionFeatures(
        plan as any,
        addons as any
      );

      // Assert
      expect(result).toEqual({
        feature1: { type: "DEFAULT" },
        feature2: { type: "METERED", metadata: { min: 10, max: 100 } },
      });
    });
  });
});
