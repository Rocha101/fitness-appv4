import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("No authorization header found");
    }

    const session = await this.authService.validateSession(authHeader);

    if (!session) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    request.user = session.user;
    request.session = session.session;

    return true;
  }
}
