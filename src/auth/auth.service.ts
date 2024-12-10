import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(userObject: RegisterAuthDto) {
    const findEmail = await this.userService.findOneByEmail(userObject.email);

    // if (findEmail) throw new HttpException('USER ALREADY EXISTS', 404);
    if (findEmail) throw new HttpException('USER ALREADY EXISTS', 409); // Cambiar 404 por 409


    const { password, username, email, currency} = userObject;
    const plainToHash = await hash(password, 10);

    const createUserDto = {
      username,
      email,
      password: plainToHash,
      registrationDate:new Date(),
      currency
    };
    const user = await this.userService.create(createUserDto);

    return { user };
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;

    const findUser = await this.userService.findOneByEmail(email);

    if (!findUser) throw new HttpException('USER NOT FOUND', 404);

    const checkPassword = await compare(password, findUser.password);

    if (!checkPassword) throw new HttpException('PASSWORD INCORRECT', 403);

    const payload = { id: findUser.id, email: findUser.email}; 
    const token = this.jwtService.sign(payload);
    const data = {
      token,
      userId: findUser.id,
    };
    
    return data;
  }
}
