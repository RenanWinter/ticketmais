export class UnavailableSpotError extends Error {
  constructor() {
    super(`Some spots are already reserved`);
  }
}
