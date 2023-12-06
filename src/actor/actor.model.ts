import { prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export class ActorModel extends TimeStamps {
  @prop()
  name: string

  @prop({ unique: true })
  slug: string

  @prop()
  photo: string
}