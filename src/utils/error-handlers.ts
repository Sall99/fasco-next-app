export function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof Error) {
    const err = error as { response?: { data: { message: string } } };
    return err.response?.data.message || fallbackMessage;
  }
  return fallbackMessage;
}
