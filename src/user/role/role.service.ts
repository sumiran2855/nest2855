import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  private readonly roles: string[] = ['user', 'admin'];

  getRoles(): string[] {
    return this.roles;
  }

  isValidRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
