import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('CanActivate', super.canActivate(context));
    // Aquí puedes agregar tu lógica personalizada de autenticación si es necesario
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log(info);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
