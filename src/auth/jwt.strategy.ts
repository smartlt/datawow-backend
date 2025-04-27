import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Define payload interface
interface JwtPayload {
  sub: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: payload.sub, username: payload.username };
  }
}
