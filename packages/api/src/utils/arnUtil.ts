export function extractArns(obj: unknown): string[] {
  const arnSet = new Set<string>();
  const arnPattern = /^arn:aws:[^:]+:[^:]*:[^:]*:.+$/;

  function traverse(value: unknown) {
    if (typeof value === "string" && arnPattern.test(value)) {
      // Skip template variables
      if (!value.includes("${")) {
        arnSet.add(value);
      }
    } else if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(traverse);
    }
  }

  traverse(obj);
  return Array.from(arnSet);
}
