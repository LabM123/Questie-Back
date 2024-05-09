import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}
  
  @Get()
  findAll() {
    return this.invoicesService.getAllInvoices();
  }
  
  @Get(':id')
  findOne(@Param('id') id: ParseUUIDPipe) {
    return this.invoicesService.getInvoiceById(id);
  }

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }
  
  @Put('pending/:id')
  updateToPending(@Param('id') id: ParseUUIDPipe) {
    return this.invoicesService.updateToPending(id);
  }

  @Put('cancelled/:id')
  updateToCancelled(@Param('id') id: ParseUUIDPipe) {
    return this.invoicesService.updateToCancelled(id);
  }

  @Put('completed/:id')
  updateToCompleted(@Param('id') id: ParseUUIDPipe) {
    return this.invoicesService.updateToCompleted(id);
  }

  @Put(':id')
  update(@Param('id') id: ParseUUIDPipe, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ParseUUIDPipe) {
    return this.invoicesService.deleteInvoice(id);
  }
}
