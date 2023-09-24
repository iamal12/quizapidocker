// role.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { RoleEnum } from 'src/constants/enums';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly requiredRole?: RoleEnum) { }

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        const user = request.user as User;
        if (!user) {
            return false;
        }
        if(user.role === RoleEnum.ADMIN){
            return true
        }
        if (user.role !== this.requiredRole) {
            throw new ForbiddenException('User is not authorized to access')
        }

        return true;
    }
}
