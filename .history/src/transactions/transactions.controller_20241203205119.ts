import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from '../transactions/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from '../transactions/entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    return await this.transactionService.createTransaction(createTransactionDto);
  }
}
