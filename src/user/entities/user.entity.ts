import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'USER' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Auth', required: true, unique: true })
  authId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
