export class TokenNotFound extends Error {
  constructor() {
    super('Token is not valid');
  }
}
