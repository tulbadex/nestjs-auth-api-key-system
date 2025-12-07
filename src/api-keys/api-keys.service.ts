import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../database/entities/api-key.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeysRepository: Repository<ApiKey>,
  ) {}

  async create(userId: string, createApiKeyDto: CreateApiKeyDto) {
    const existingKey = await this.apiKeysRepository.findOne({
      where: { userId, name: createApiKeyDto.name },
    });

    if (existingKey) {
      throw new ConflictException('API key with this name already exists');
    }

    const key = this.generateApiKey();
    
    const apiKey = this.apiKeysRepository.create({
      key,
      name: createApiKeyDto.name,
      userId,
      expiresAt: createApiKeyDto.expiresAt ? new Date(createApiKeyDto.expiresAt) : null,
    });

    await this.apiKeysRepository.save(apiKey);

    return {
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt,
    };
  }

  async findAll(userId: string) {
    const apiKeys = await this.apiKeysRepository.find({
      where: { userId },
      select: ['id', 'name', 'isActive', 'expiresAt', 'lastUsedAt', 'createdAt'],
      order: { createdAt: 'DESC' },
    });

    return apiKeys;
  }

  async revoke(userId: string, keyId: string) {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { id: keyId, userId },
    });

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    apiKey.isActive = false;
    await this.apiKeysRepository.save(apiKey);

    return { message: 'API key revoked successfully' };
  }

  async validateApiKey(key: string): Promise<any> {
    const apiKey = await this.apiKeysRepository.findOne({
      where: { key, isActive: true },
      relations: ['user'],
    });

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      throw new UnauthorizedException('API key expired');
    }

    if (!apiKey.user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    apiKey.lastUsedAt = new Date();
    await this.apiKeysRepository.save(apiKey);

    return { userId: apiKey.userId, email: apiKey.user.email, type: 'service' };
  }

  private generateApiKey(): string {
    const prefix = 'sk';
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${prefix}_${randomBytes}`;
  }
}
