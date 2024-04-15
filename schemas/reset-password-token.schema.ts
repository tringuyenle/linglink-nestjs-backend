import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({timestamps: true, expireAfterSeconds: 120})
export class ReserPasswordToken {
    _id: ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    user_id: User;

    @Prop()
    token: string;
};

export const ReserPasswordTokenSchema = SchemaFactory.createForClass(ReserPasswordToken);
