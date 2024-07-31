import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context) as
      | boolean
      | Promise<boolean>
      | Observable<boolean>;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
export function isLoggedIn() {
  const token = localStorage.getItem('access_token');
  return !!token;
}

export function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role === 'admin';
}
