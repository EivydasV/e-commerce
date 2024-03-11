export type OmitBaseType<Entity> = Omit<
  Entity,
  '_id' | 'createdAt' | 'updatedAt'
>;
