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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new module' })
  @ApiResponse({
    status: 201,
    description: 'The module has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: [CreateModuleDto] })
  create(@Body() createModuleDto: CreateModuleDto[]) {
    return this.modulesService.createModule(createModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @ApiResponse({ status: 200, description: 'Return all modules.' })
  findAll() {
    return this.modulesService.getAllModules();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all modules including deleted ones (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all modules including deleted ones.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAllWithDeleted() {
    return this.modulesService.getAllModules(true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the module with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiParam({ name: 'id', description: 'UUID of the module to retrieve' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.modulesService.getModulesById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a module' })
  @ApiResponse({
    status: 200,
    description: 'The module has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiBody({ type: [UpdateModuleDto] })
  @ApiParam({ name: 'id', description: 'UUID of the module to update' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto[],
  ) {
    return this.modulesService.updateModule(id, updateModuleDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a module' })
  @ApiResponse({
    status: 200,
    description: 'The module has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiParam({ name: 'id', description: 'UUID of the module to delete' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.modulesService.removeModule(id);
  }
}
