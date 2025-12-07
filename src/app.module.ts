import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { User } from './database/entities/user.entity';
import { ApiKey } from './database/entities/api-key.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'auth_api_key_db',
      entities: [User, ApiKey],
      synchronize: true,
      logging: false,
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    UsersModule,
    ApiKeysModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
