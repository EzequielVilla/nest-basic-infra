import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
