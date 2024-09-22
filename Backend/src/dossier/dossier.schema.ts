import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Dossier extends Document {
  @Prop({ required: false })
  dossierFacileUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop([{ 
    ownerId: { type: Types.ObjectId, ref: 'users' },
    isValidated: { type: Boolean, default: false }
  }])
  owners: Array<{ ownerId: Types.ObjectId, isValidated: boolean }>;
}

export const DossierSchema = SchemaFactory.createForClass(Dossier);