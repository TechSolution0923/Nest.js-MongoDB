import { prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export interface UserModel extends Base {}

export class GenreModel extends TimeStamps{
    @prop()
    name: string

    @prop({ unique: true })
    slug: string

    @prop()
    description: string

    @prop()
    icon: string
}