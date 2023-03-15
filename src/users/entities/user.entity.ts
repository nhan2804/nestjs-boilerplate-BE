import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  username: string;
  @Prop({ default: 'Ngoc Nhan Default FUll Name ' + Math.random() })
  fullName: string;
  @Prop()
  ssoId: string;
  @Prop()
  ssoEmail: string;
  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: Math.floor(Math.random() * 1000) })
  otp: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
