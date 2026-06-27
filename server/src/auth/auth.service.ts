import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../common/dto/auth/register.dto';
import { LoginDto } from 'src/common/dto/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private signTokens(user: { id: string; role: Role }) {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      role: Role.LANDLORD,
    });

    const { password: _, ...safeUser } = user;

    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signTokens({ id: user.id, role: user.role as Role });
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);

    const accessToken = this.jwtService.sign(
      {
        sub: payload.sub,
        role: payload.role,
      },
      {
        expiresIn: '15m',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
