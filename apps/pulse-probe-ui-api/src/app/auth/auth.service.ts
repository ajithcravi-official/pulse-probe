import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateUserDto, LoginUserDto } from '../user/dto';
import { buildServiceResponse, CatchServiceErrors } from '../common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @CatchServiceErrors()
  async validateUser({ email, password }: LoginUserDto): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return buildServiceResponse(
        new UnauthorizedException('Invalid credentials')
      );
    }

    const { password: _, ...sanitizedUser } = user.toObject();

    return buildServiceResponse(sanitizedUser, 'User validated successfully');
  }

  @CatchServiceErrors()
  async login(credentials: LoginUserDto) {
    const validationResponse = await this.validateUser(credentials);

    if (!validationResponse.success || !validationResponse.data) {
      return validationResponse; // return the 401 response from validateUser
    }

    const user = validationResponse.data;
    const payload = { email: user.email, sub: user._id };

    return buildServiceResponse(
      {
        access_token: this.jwtService.sign(payload),
      },
      'Login successful'
    );
  }

  @CatchServiceErrors()
  async register({ name, email, password }: CreateUserDto) {
    // Check if email already exists
    const existing = await this.userService.findByEmail(email);
    if (existing) {
      return buildServiceResponse(
        new ConflictException('User with this email already exists')
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      name,
      email,
      password: hashed,
    });

    return buildServiceResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      'User registered successfully'
    );
  }
}
