import {
  prop,
  getModelForClass,
  modelOptions,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_hsk_words",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
})
export class HskWord extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  chinese!: string;

  @prop({ type: String, required: true })
  pinyin!: string;

  @prop({ type: String, required: true })
  english!: string;

  @prop({ type: String, required: false, default: "" })
  exampleSentence!: string;

  @prop({ type: String, required: false, default: "" })
  examplePinyin!: string;

  @prop({ type: String, required: false, default: "" })
  exampleEnglish!: string;

  @prop({ type: Number, required: true, min: 1, max: 7 })
  hskLevel!: number;

  @prop({ type: String, required: false, default: "" })
  audioUrl!: string;

  @prop({ type: Boolean, required: false, default: true })
  isActive!: boolean;
}

export const HskWordModel = getModelForClass(HskWord);
