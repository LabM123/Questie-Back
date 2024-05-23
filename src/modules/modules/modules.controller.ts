import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.createModule(createModuleDto);
  }

  @Get()
  findAll() {
    return this.modulesService.getAllModules();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllWithDeleted() {
    return this.modulesService.getAllModules(true);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.modulesService.getModulesById(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.updateModule(id, updateModuleDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.modulesService.removeModule(id);
  }

  /*  @Post(':id')
  seeder() {
    return this.modulesService.seeder();
  }
    
  @Put("seed")
  updateSeed() {
    return this.modulesService.updateMod();
  } */
}
