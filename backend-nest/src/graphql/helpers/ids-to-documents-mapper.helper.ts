import { Document } from 'mongoose';
import { DocId } from 'src/db/types/doc-id.type';

export const idsToDocumentsMapper = async <T extends Document>(
  docs: T[],
  ids: readonly DocId[],
) => {
  return ids.map(
    (categoryId) =>
      docs.find((doc) => doc._id.toString() === categoryId.toString())!,
  );
};
