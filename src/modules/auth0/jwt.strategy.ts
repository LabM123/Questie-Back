/* import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://dev-elwqbme2u7whwwv8.us.auth0.com/.well-known/jwks.json`,
      }),
      audience: 'https://questie-back-latest.onrender.com/',
      issuerBaseURL: 'https://dev-elwqbme2u7whwwv8.us.auth0.com/',
      algorithms: ['hs256'],
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
 */