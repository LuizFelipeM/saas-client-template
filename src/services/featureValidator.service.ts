async function featureValidator<T>(
  featureKey: string,
  fn: () => Promise<T>
): Promise<T | undefined> {
  if (!canUse()) return;

  try {
    return await fn();
  } finally {
    incrementUsage();
  }
}
