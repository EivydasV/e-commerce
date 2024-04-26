export class UnsupportedOperatorError extends Error {
  constructor(operator: string) {
    super(`Operator "${operator}" is not supported`);
    this.name = this.constructor.name;
  }
}
