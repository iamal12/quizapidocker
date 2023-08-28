import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(private readonly jwtStragegy: JwtService, 
        @Inject(forwardRef(()=>UsersService))
        private userService: UsersService) {

    }
    async loginUsingEmail(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (user && bcryptjs.compareSync(password, user.password)) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user:any){
        const payload = {username: user.email,sub: user.id}
        return {
            access_token: this.jwtStragegy.signAsync(payload)
        }
    }
}
