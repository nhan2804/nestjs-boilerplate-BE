import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseArrayPipe,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { BaseController } from 'src/app/controllers/base.controller';
import { ValidIdPipe } from 'src/app/pipes/validation.pipe';
import { UserLoggin } from 'src/auth/decorators/user';
import { UResult } from 'src/helper/ulti';
import { UserDocument } from 'src/users/entities/user.entity';
import { ProjectModel } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController extends BaseController<ProjectModel> {
  constructor(readonly service: ProjectsService) {
    super(service);
  }

  @Get('/schema')
  schema(@Param('filter') filter: false, @Param('sort') sort: false) {
    const fields = [
      { name: 'name', type: 'string' },
      { name: 'title', type: 'string' },
    ];
    if (filter) {
      fields.concat([
        { name: 'description', type: 'string' },
        { name: 'owner', type: 'string' },
      ]);
    }

    return UResult(true, '', fields);
  }
  @Get('/')
  //current user
  async getALl(@UserLoggin() user: UserDocument) {
    return this.service.baseFilter();
  }
  @Post('/')
  //current user
  async create(@Body() req: ProjectModel, @UserLoggin() user: UserDocument) {
    // Validate req
    // Ex: reset some fields if role of session not allow

    /*Check double xid [redis]*/
    const project = await this.service.baseCreate(req);

    return project;
  }
  @Patch('/:id')
  //current user
  async update(
    @Param('id', ValidIdPipe) id: string,
    @Body() body: ProjectModel,
    @UserLoggin() user: UserDocument,
  ) {
    // Validate req
    // Ex: reset some fields if role of session not allow

    /*Check double xid [redis]*/
    return this.service.baseUpdateOne(id, body);
  }
  @Delete('/:id')
  //current user
  async deleteP(
    @Param('id', ValidIdPipe) id: string,

    @UserLoggin() user: UserDocument,
  ) {
    // Validate req
    // Ex: reset some fields if role of session not allow

    /*Check double xid [redis]*/
    return this.service.baseDeleteOnce(id);
  }

  @Post('/import')
  import(@Body(new ParseArrayPipe({ items: ProjectModel })) req) {
    return this.service.baseCreateArray(req);
  }

  @Put('/many')
  updateMany(@Body('search') filter: ProjectModel, @Body('update') req) {
    // filter the sam with filter router
    // Validate req
    // Ex: reset some fields if role of session not allow
    return this.service.baseUpdateMany(filter, req);
  }
  @Put('/array')
  updateArray(@Body() req: []) {
    // Validate req
    // Ex: reset some fields if role of session not allow
    const values = req.map((e: any) => {
      const { id, ...rest } = e;
      return {
        updateOne: {
          filter: { _id: e['_id'] },
          update: { $set: rest },
        },
      };
    });
    return this.service.baseUpdateArray(values);
  }

  @Put(':id')
  updateOnce(@Param('id', ValidIdPipe) id: string, @Body() req: ProjectModel) {
    // Validate req
    // Ex: reset some fields if role of session not allow
    return this.service.baseUpdateOne(id, req);
  }
}
