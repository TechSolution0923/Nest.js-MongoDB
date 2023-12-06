import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { GenreModel } from './genre.model';
import { CreateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenreService {
  constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>) {

  }

  async bySlug(slug: string) {
    const doc = await this.GenreModel.findOne({ slug }).exec()
    if (!doc) {
      throw new NotFoundException('Genre Not Found')
    }

    return doc
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp(searchTerm, 'i')
          },
          {
            description: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }

    return this.GenreModel.find(options)
      .select('-updatedAt -v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  async getCollections() {
    const genres = await this.getAll()

    return genres
  }

  // Admin place

  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id)
    if(!genre) throw new NotFoundException('Genre not found')
    return genre
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: ''
    }
    const genre = await this.GenreModel.create(defaultValue)
    return genre._id
  }

  async update(_id: string, dto: CreateGenreDto) {
    const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!updateGenre) throw new NotFoundException('Genre Not Found')

    return updateGenre
  }

  async delete(id: string) {
      const deleteGenre =  this.GenreModel.findByIdAndDelete(id).exec()

      if(!deleteGenre) throw new NotFoundException('Genre Not Found')

      return deleteGenre
  }
}
