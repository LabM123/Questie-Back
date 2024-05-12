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
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags("Contents")
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.contentsService.findAll();
  }
  
  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }
  
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentsService.update(id, updateContentDto);
  }
  
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.remove(id);
  }
}
