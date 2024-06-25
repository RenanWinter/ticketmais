export class TokenExpired extends Error {
  constructor() {
    super('Token expired');
  }
}
