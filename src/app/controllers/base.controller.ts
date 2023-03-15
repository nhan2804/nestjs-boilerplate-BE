import { Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProjectModel } from 'src/projects/entities/project.entity';
import { BaseDocument, BaseModel } from '../models/base.schema';
// import { AuthGuard } from 'src/auth/auth.guard';
import { NotEmptyPipe, ValidIdPipe } from '../pipes/validation.pipe';
import { BaseService } from './services/base.service';

// @UseGuards(AuthGuard)
export class BaseController<T> {
  constructor(protected service: BaseService<T & BaseDocument>) {}

  @Get(':id')
  findOne(@Param('id', ValidIdPipe) id: string) {
    return this.service.baseFindOne(id);
  }

  @Delete('/many')
  deleteMany(@Body(NotEmptyPipe) req) {
    return this.service.baseDeleteMany(req);
  }

  @Delete(':id')
  delete(@Param('id', ValidIdPipe) id: string) {
    return this.service.baseDeleteOnce(id);
  }
}
