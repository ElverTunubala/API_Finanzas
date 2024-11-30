import { PartialType } from '@nestjs/swagger';
import { LoginAuthDto } from './login.dto';
import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsDate()
    @IsDateString()  
    registrationDate: Date ;
  
    @IsString()
    currency: string;
}
