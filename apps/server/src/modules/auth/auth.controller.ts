import { All, Controller, Req, Res } from "@nestjs/common";
import { ApiTags, ApiExcludeEndpoint } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @All("**")
  @ApiExcludeEndpoint()
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return this.authService.instance.handler(req as any);
  }
}
