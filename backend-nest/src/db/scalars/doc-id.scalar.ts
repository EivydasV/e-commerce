import { GraphQLScalarType } from 'graphql/type';
import { Types } from 'mongoose';
import { Kind } from 'graphql/language';

function validate(docID: any): Types.ObjectId {
  if (Types.ObjectId.isValid(docID)) {
    return new Types.ObjectId(docID as string);
  }

  throw new Error('invalid id');
}

export const DocIdScalar = new GraphQLScalarType({
  name: 'DocId',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new Error('invalid id');
    }

    return validate(ast.value);
  },
});
