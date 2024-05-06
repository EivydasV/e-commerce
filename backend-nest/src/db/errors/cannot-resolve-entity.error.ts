export class CannotResolveEntityError extends Error {
  constructor(entityPath: string) {
    super(`cannot resolve entity from path: "${entityPath}"`);
    this.name = CannotResolveEntityError.name;
  }
}
