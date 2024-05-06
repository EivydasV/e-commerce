import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdentifiableSchema } from 'src/db/schema/identifiable.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { SubjectEnum } from 'src/casl/enums/subject.enum';
import GraphQLJSON from 'graphql-type-json';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema()
@ObjectType()
export class Permission extends IdentifiableSchema {
  @Prop({ required: true, enum: ActionEnum })
  action: ActionEnum;

  @Prop({ required: true, enum: SubjectEnum })
  subject: SubjectEnum;

  @Prop({ required: false, type: Object })
  @Field(() => GraphQLJSON, { nullable: true })
  conditions?: Record<string, Record<string, string>>;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
