import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all',
    description:'Search all available courses, modules, lessons and products.',
  })
  @Get()
  findAll() {
    return this.searchService.findAll();
  }
}
