import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find all',
    description: 'Search all available courses, modules, lessons and products.',
  })
  @Get(':query')
  findAll(@Param('query') query: string) {
    return this.searchService.findAll(query);
  }
}
