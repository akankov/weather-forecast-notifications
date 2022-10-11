import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  @Inject()
  private readonly prismaService: PrismaService;

  async getUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
}
