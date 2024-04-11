export const entityTypeCheck = (
  entity: unknown,
  entityName: string,
): boolean => {
  return (
    entity !== null &&
    typeof entity === 'object' &&
    'entityName' in entity &&
    entity.entityName === entityName
  );
};
