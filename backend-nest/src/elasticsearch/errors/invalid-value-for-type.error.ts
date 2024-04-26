export class InvalidValueForTypeError extends Error {
  constructor(type: string, value: string, field: string) {
    super(
      `Value must be a "${type}". Got "${value}" instead. Field: "${field}"`,
    );
    this.name = this.constructor.name;
  }
}
