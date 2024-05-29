import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class PurchaseGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers['x-purchase-transaction-secret'];

      if (!token) throw new UnauthorizedException('Missing purchase header');

      const secret = new TextEncoder().encode(
        process.env.PURCHASE_TRANSACTION_SECRET,
      );

      const approvedToken = await jose.jwtVerify(token, secret);

      console.log(approvedToken);

      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }
}
