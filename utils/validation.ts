export const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;

export const matchesISOTimestamp = (timestamp: string) => {
  return ISO_TIMESTAMP_PATTERN.test(timestamp);
};
