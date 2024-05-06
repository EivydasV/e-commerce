import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IdentifiableSchema } from 'src/db/schema/identifiable.schema';
import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Permission } from './permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  toObject: { getters: true },
  toJSON: { getters: true },
})
@ObjectType()
export class Role extends IdentifiableSchema {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop([{ type: Permission, maxlength: 100 }])
  @Field(() => [Permission])
  permissions?: Types.DocumentArray<Permission>;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
