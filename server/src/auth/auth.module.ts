import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local/local.strategy';
import { JwtStrategy } from './strategies/local/jwt.stratgey';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_KEY,
    global: true,
    signOptions: {
      expiresIn: 3600,
    },
  }), forwardRef(() => UsersModule)],
  exports: [AuthService]
})
export class AuthModule { }
