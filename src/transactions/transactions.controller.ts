import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionEntity } from '../transactions/entities/transaction.entity';
import { TransactionService } from '../transactions/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    return await this.transactionService.createTransaction(createTransactionDto);
  }

  @Get('user/:userId')
  async findTransactionsByUserId(@Param('userId') userId: string): Promise<TransactionEntity[]> {
    return await this.transactionService.findTransactionsByUserId(userId);
  }
}
