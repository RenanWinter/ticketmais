export class SpotsNotFoundError extends Error {
  constructor(spotNames: string[]) {
    super(`Spots not found: ${spotNames.join(', ')}`);
  }
}
