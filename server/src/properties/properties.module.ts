import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Property } from 'src/entity/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property])],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
