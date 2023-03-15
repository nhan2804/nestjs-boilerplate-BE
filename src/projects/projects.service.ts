import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/app/controllers/services/base.service';
import { ProjectDocument, ProjectModel } from './entities/project.entity';

@Injectable()
export class ProjectsService extends BaseService<ProjectModel> {
  constructor(
    @InjectModel(ProjectModel.name)
    readonly model: Model<ProjectDocument>,
  ) {
    super(model);
  }
}
