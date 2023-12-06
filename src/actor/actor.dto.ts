import { IsString } from "class-validator"

export class ActorDto {
  @IsString()
  name: string

  @IsString()
  slug: string

  @IsString()
  photo: string
}