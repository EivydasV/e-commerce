import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { HideField, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';
import { OffsetPaginated } from '../../graphql/paginations/offset/paginated.offset';

export type UserDocument = HydratedDocument<User>;
@Schema({
  timestamps: true,
})
@ObjectType()
export class User extends TimestampsSchema {
  @Prop({ required: true, maxlength: 255, unique: true })
  email: string;

  @Prop({ required: true, maxlength: 255 })
  @HideField()
  password: string;

  @Prop({ required: true, maxlength: 255 })
  firstName: string;

  @Prop({ required: true, maxlength: 255 })
  lastName: string;

  @Prop({ required: false, maxlength: 255 })
  @HideField()
  forgotPasswordToken?: string;

  @Prop({ required: false })
  @HideField()
  forgotPasswordTokenExpiresAt?: Date;
}

@ObjectType()
export class OffsetPaginatedUser extends OffsetPaginated(User) {}

export const UserSchema = SchemaFactory.createForClass(User);
