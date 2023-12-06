import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { GenreIdsDto } from './dto/genreIds.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MovieService {
  constructor(@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) {
    
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
    if (!doc) {
      throw new NotFoundException('Movie not found')
    }
    return doc
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec()
    if (!doc) {
      throw new NotFoundException('Movie not found')
    }
    return doc
  }

  async byGenres(dto: GenreIdsDto) {  
    const doc = await this.MovieModel.find({ genres: {$in: dto.genreIds} }).exec()
    if (!doc) {
      throw new NotFoundException('Movie not found')
    }
    return doc
  }

  async getMostPopular() {
    const docs = await this.MovieModel.find({ countOpened: {$gt: 0} }).sort({ countOpened: -1 }).populate('genres').exec()
    if (!docs) {
      throw new NotFoundException('Movies not found')
    }
    return docs
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.MovieModel.findOneAndUpdate( {slug}, {$inc: {countOpened: 1}}, {new: true} ).exec()

    if(!updateDoc) throw new NotFoundException('Movie Not Found')

    return updateDoc
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i')
          }
        ]
      } 
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec()
  }

  async updateRating(movieId: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(movieId, { rating: newRating }, { new: true }).exec()
  }

  /* Admin place */
  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id)
    if(!movie) throw new NotFoundException('actor not found')
    return movie
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: ''
    }
    const actor = await this.MovieModel.create(defaultValue)
    return actor._id
  }

  async update(_id: string, dto: UpdateMovieDto) {
    /* Telegram Notification */
    const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!updateDoc) throw new NotFoundException('actor Not Found')

    return updateDoc
  }

  async delete(id: string) {
      const deleteDoc =  this.MovieModel.findByIdAndDelete(id).exec()

      if(!deleteDoc) throw new NotFoundException('actor Not Found')

      return deleteDoc
  }
}
