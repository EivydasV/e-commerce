export class UnsupportedFieldError extends Error {
  constructor(field: string) {
    super(`Field "${field}" is not supported.`);
    this.name = this.constructor.name;
  }
}
