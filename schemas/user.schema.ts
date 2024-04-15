import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRoles } from '../src/common/enums/user.enum';
import { TargetTypes } from '../src/common/enums/target.enum';
import { IsEnum } from 'class-validator';
import { ObjectId } from 'mongoose';

export class Target {
    targetType: TargetTypes;

    targetScore: number;

    currentScore: { type: number, default: 0 };

    targetDate: Date;
};

@Schema({ timestamps: true })
export class User {
    _id: ObjectId;

    @Prop({unique: true})
    email: string;

    @Prop()
    hashedPassword: string;

    @Prop()
    name: string;

    @Prop({ type: String, enum: UserRoles, default: UserRoles.STUDENT })
    @IsEnum(UserRoles)
    role: UserRoles;

    @Prop()
    avatar: string;
    target: Target;

};

export const UserSchema = SchemaFactory.createForClass(User);
