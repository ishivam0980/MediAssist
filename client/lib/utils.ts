export const handleError = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    message = String((error as { message: unknown }).message);
  } else {
    message = "An unknown error occurred";
  }

  console.error("An error occurred:", message);
  return message;
};
