const MUTATION_DELAY_MS = 600;
const ERROR_RATE = 0.2;

export async function simulateMutation(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MUTATION_DELAY_MS));

  if (Math.random() < ERROR_RATE) {
    throw new Error("Сервис временно недоступен");
  }
}
