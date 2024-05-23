import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'; // Importamos jsonwebtoken

@Injectable()
export class Auth0Guard implements CanActivate {
  private readonly jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Invalid token format');
    }

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      // Decodificar el token JWT para obtener el payload
      const decodedToken = jwt.decode(token, { complete: true });

      // Verificar si el token es válido
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      // Extraer el payload
      const payload = decodedToken.payload;
      console.log('Payload del token:', payload);

      // Verificar el token usando jwtService
      const secret = 'meudeuscara'; // Aquí cargamos el secret directamente en el código
      console.log(secret);

      const decoded = this.jwtService.verify(token, {
        secret,
        audience: 'questie-back-latest.onrender.com', // AUDIENCE directamente cargado
        issuer: 'https://dev-elwqbme2u7whwwv8.us.auth0.com/', // DOMAIN directamente cargado
        algorithms: ['RS256'],
      });

      console.log(decoded);

      request.user = decoded;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
