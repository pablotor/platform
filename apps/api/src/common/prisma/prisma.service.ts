import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('database.url');
    const pool = new PrismaPg({ connectionString });
    super({ adapter: pool });
  }
}
