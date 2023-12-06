import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {

  }

  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?:string): Promise<any> {
    return this.fileService.saveFiles([file], folder)
  }
}
