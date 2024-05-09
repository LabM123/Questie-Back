import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ){}

  async createInvoice(createInvoiceDto: CreateInvoiceDto){
      try {
        const {user_id, product_id} = createInvoiceDto;
        const foundedUser = await this.usersRepository.findOne({where:{id:user_id}});
        const foundedProduct = await this.productsRepository.findOne({where: {id:product_id}});
        if(!foundedUser) throw new BadRequestException('User not found')
        if(!foundedProduct) throw new BadRequestException('Product not found')
        const newInvoice = {
          user_id,
          product_id,
          status: 'Pending',
          product: foundedProduct,
          user: foundedUser,
          total: foundedProduct.price
        }
        const savedInvoice = await this.invoicesRepository.save(newInvoice);
        return savedInvoice;
        // const foundedInvoice = await this.invoicesRepository.findOne({where:{id:savedInvoice.id}});
        // return foundedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async getAllInvoices(){
      try {
          const allInvoices = await this.invoicesRepository.find();
          return allInvoices;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async getInvoiceById(id){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          return foundedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async updateToCompleted(id){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          foundedInvoice.status = 'Completed';
          await this.invoicesRepository.update(id, foundedInvoice);
          const updatedInvoice = await this.invoicesRepository.findOne({where: {id}});
          return updatedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async updateToPending(id){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          foundedInvoice.status = 'Pending';
          await this.invoicesRepository.update(id, foundedInvoice);
          const updatedInvoice = await this.invoicesRepository.findOne({where: {id}});
          return updatedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async updateToCancelled(id){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          foundedInvoice.status = 'Cancelled';
          await this.invoicesRepository.update(id, foundedInvoice);
          const updatedInvoice = await this.invoicesRepository.findOne({where: {id}});
          return updatedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async updateInvoice(id, updateInvoiceDto: UpdateInvoiceDto){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          await this.invoicesRepository.update(id, updateInvoiceDto);
          const updatedInvoice = await this.invoicesRepository.findOne({where: {id}});
          return updatedInvoice;
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }

  async deleteInvoice(id){
      try {
          const foundedInvoice = await this.invoicesRepository.findOne({where: {id}});
          if(!foundedInvoice) throw new BadRequestException('Invoice not found');
          foundedInvoice.deleted_at = new Date();
          await this.invoicesRepository.update(id, foundedInvoice);
          return {message: 'Deleted'}
      } catch (error: any) {
          throw new BadRequestException(error.message)
      }
  }
}
