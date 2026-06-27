import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: Partial<User>) {
    const user = this.repo.create({
      ...data,
      email: data.email?.toLowerCase().trim(),
    });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
      select: ['id', 'email', 'password', 'role', 'fullName'],
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'role',
        'fullName',
        'bankName',
        'accountNumber',
        'accountName',
      ],
    });
  }

  async getBankDetails(userId: string) {
    const user = await this.findById(userId);
    if (!user) return null;

    return {
      bankName: user.bankName ?? '',
      accountNumber: user.accountNumber ?? '',
      accountName: user.accountName ?? '',
    };
  }

  async updateBankDetails(
    userId: string,
    dto: { bankName: string; accountNumber: string; accountName: string },
  ) {
    await this.repo.update(userId, {
      bankName: dto.bankName.trim(),
      accountNumber: dto.accountNumber.trim(),
      accountName: dto.accountName.trim(),
    });

    return this.getBankDetails(userId);
  }
}
