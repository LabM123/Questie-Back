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
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createInvoice({
    userId,
    productId,
  }: CreateInvoiceDto): Promise<string> {
    try {
      const foundUser = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!foundUser) throw new NotFoundException('User not found');

      const foundProduct = await this.productsRepository.findOne({
        where: { id: productId },
      });
      if (!foundProduct) throw new NotFoundException('Product not found');

      const savedInvoice = await this.invoicesRepository.save(
        this.invoicesRepository.create({
          status: 'Pending',
          product: foundProduct,
          user: foundUser,
          total: foundProduct.price,
        }),
      );

      return savedInvoice.id;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllInvoices(withDeleted: boolean = false) {
    try {
      const allInvoices = await this.invoicesRepository.find({
        select: {
          id: true,
          status: true,
          total: true,
          created_at: true,
          product: {
            name: true,
          },
          user: {
            id: true,
          },
        },
        relations: ['product', 'user'],
        withDeleted,
      });

      return allInvoices;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getInvoiceById(id: string) {
    try {
      const foundedInvoice = await this.invoicesRepository.findOne({
        where: { id },
        select: {
          id: true,
          status: true,
          total: true,
          created_at: true,
          product: {
            name: true,
          },
          user: {
            id: true,
          },
        },
        relations: ['product', 'user'],
      });
      if (!foundedInvoice) throw new NotFoundException('Invoice not found');
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
      if (!foundedInvoice) throw new NotFoundException('Invoice not found');
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
      if (!foundedInvoice) throw new NotFoundException('Invoice not found');
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
      if (!foundedInvoice) throw new NotFoundException('Invoice not found');

      const user = await this.usersRepository.findOne({
        where: { id: updateInvoiceDto.userId },
      });
      if (!user) throw new NotFoundException('User not found');

      const product = await this.productsRepository.findOne({
        where: { id: updateInvoiceDto.productId },
      });
      if (!product) throw new NotFoundException('Product not found');

      await this.invoicesRepository.update(id, {
        user,
        product,
      });

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
      if (!foundedInvoice) throw new NotFoundException('Invoice not found');
      foundedInvoice.deleted_at = new Date();
      await this.invoicesRepository.update(id, foundedInvoice);
      return { message: 'Deleted' };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
