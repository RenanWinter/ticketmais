export class AppError extends Error {
  public code: number = 400;
  constructor(message: string, code: number) {
    super(message);
    code && (this.code = code);
  }
}
