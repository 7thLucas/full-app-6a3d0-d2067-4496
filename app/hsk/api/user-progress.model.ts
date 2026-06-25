import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_user_progress",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class UserProgress extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  userId!: string;

  @prop({ type: Number, required: true, min: 1, max: 7 })
  hskLevel!: number;

  @prop({ type: [String], default: [] })
  learnedWordIds!: string[];

  @prop({ type: Number, default: 0 })
  streak!: number;

  @prop({ type: String, required: false, default: null })
  lastStudiedAt?: string | null;

  @prop({ type: Number, default: 0 })
  totalCorrect!: number;

  @prop({ type: Number, default: 0 })
  totalAttempted!: number;
}

export const UserProgressModel = getModelForClass(UserProgress);
