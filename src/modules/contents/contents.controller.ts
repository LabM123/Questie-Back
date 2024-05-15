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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Contents')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Find all contents',
    description: 'Retrieve all contents.',
  })
  findAll() {
    return this.contentsService.findAll();
  }

  @ApiBearerAuth()
  @Get('deleted')
  @ApiOperation({
    summary: 'Find all with deleted',
    description: 'Retrieve all contents, including deleted ones.',
  })
  findAllWithDeleted() {
    return this.contentsService.findAll(true);
  }

  @Get(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Find one content',
    description: 'Retrieve a single content by its ID.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.findOne(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create content',
    description: 'Create a new content.',
  })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update content',
    description: 'Update an existing content by its ID.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentsService.update(id, updateContentDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Remove content',
    description: 'Remove a content by its ID.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.remove(id);
  }
}
