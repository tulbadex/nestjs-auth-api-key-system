import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { FlexibleAuthGuard } from './common/guards/flexible-auth.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './common/guards/api-key-auth.guard';

@ApiTags('Protected Routes')
@Controller()
export class AppController {
  @Get('protected/user-only')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected route - User JWT only' })
  getUserOnlyData(@Request() req) {
    return {
      message: 'This route is accessible only with user JWT token',
      user: req.user,
      accessType: 'user',
    };
  }

  @Get('protected/service-only')
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Protected route - Service API key only' })
  getServiceOnlyData(@Request() req) {
    return {
      message: 'This route is accessible only with API key',
      user: req.user,
      accessType: 'service',
    };
  }

  @Get('protected/flexible')
  @UseGuards(FlexibleAuthGuard)
  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Protected route - Both user JWT and service API key accepted' })
  getFlexibleData(@Request() req) {
    return {
      message: 'This route accepts both user JWT and API key',
      user: req.user,
      accessType: req.user.type || 'user',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
