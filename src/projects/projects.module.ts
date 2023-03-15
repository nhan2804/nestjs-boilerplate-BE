import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModel, ProjectSchema } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    MongooseModule.forFeature([
      { name: ProjectModel.name, schema: ProjectSchema },
    ]),
  ],
})
export class ProjectsModule {}
