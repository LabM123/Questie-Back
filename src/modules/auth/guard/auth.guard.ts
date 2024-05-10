import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const authHeader = request.headers.authorization;
      if (!authHeader) throw new UnauthorizedException("Missing header");

      const bearer = request.headers.authorization.split(" ")[0];
      if (bearer !== "Bearer") throw new UnauthorizedException("Invalid token");

      const token = request.headers.authorization.split(" ")[1];
      if (!token) throw new UnauthorizedException("Missing token");

      const secret = process.env.JWT_SECRET;

      const user = this.jwtService.verify(token, { secret });

      user.exp = new Date(user.exp * 1000);

      /* if (user.isAdmin) user.roles = ['admin'];
      else user.roles = ['user']; */
      user.roles = user.isAdmin;
      request.user = user;

      return true;
    } catch (error : any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
