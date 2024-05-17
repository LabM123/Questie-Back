import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.invoicesService.getAllInvoices();
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.getInvoiceById(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }

  /*   @ApiBearerAuth()
  @Put('pending/:id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  updateToPending(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.updateToPending(id);
  }

  @ApiBearerAuth()
  @Put('pending/:id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('cancelled/:id')
  updateToCancelled(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.updateToCancelled(id);
  }

  @ApiBearerAuth()
  @Put('pending/:id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Put('completed/:id')
  updateToCompleted(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.updateToCompleted(id);
  } */

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.updateInvoice(id, updateInvoiceDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.invoicesService.deleteInvoice(id);
  }
}
