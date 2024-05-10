import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createInvoice(userId: string, productId: string): Promise<string> {
    try {
      const foundUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!foundUser) throw new BadRequestException('User not found');

      const foundProduct = await this.productsRepository.findOne({
        where: { id: productId },
      });
      if (!foundProduct) throw new BadRequestException('Product not found');

      const newInvoice = {
        userId,
        productId,
        status: 'Pending',
        product: foundProduct,
        user: foundUser,
        total: foundProduct.price,
      };

      const savedInvoice = await this.invoicesRepository.save(newInvoice);

      return savedInvoice.id;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllInvoices() {
    try {
      const allInvoices = await this.invoicesRepository.find();
      return allInvoices;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getInvoiceById(id: string) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundedInvoice) throw new BadRequestException('Invoice not found');
      return foundedInvoice;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateToCompleted(id: string): Promise<Invoice> {
    try {
      const foundInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundInvoice) throw new NotFoundException('Invoice not found');

      foundInvoice.status = 'Completed';

      await this.invoicesRepository.update(id, foundInvoice);

      const updatedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });

      return updatedInvoice;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateToPending(id: string) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundedInvoice) throw new BadRequestException('Invoice not found');
      foundedInvoice.status = 'Pending';
      await this.invoicesRepository.update(id, foundedInvoice);
      const updatedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      return updatedInvoice;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateToCancelled(id: string) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundedInvoice) throw new BadRequestException('Invoice not found');
      foundedInvoice.status = 'Cancelled';
      await this.invoicesRepository.update(id, foundedInvoice);
      const updatedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      return updatedInvoice;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundedInvoice) throw new BadRequestException('Invoice not found');
      await this.invoicesRepository.update(id, updateInvoiceDto);
      const updatedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      return updatedInvoice;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteInvoice(id: string) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
      });
      if (!foundedInvoice) throw new BadRequestException('Invoice not found');
      foundedInvoice.deleted_at = new Date();
      await this.invoicesRepository.update(id, foundedInvoice);
      return { message: 'Deleted' };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
