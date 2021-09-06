import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';
@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
        private jwtService: JwtService,
        private roleService: RolesService){}


    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        const role = await this.roleService.getRoleByValue('ADMIN')/////////////////////////////////////////////////////
        user.UserRoles = role
        
        console.log(user)
        return this.generateToken(user)
    }


    async registration(userDto:CreateUserDto){
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (candidate[0]){
            throw new HttpException('пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        console.log('j')
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password:hashPassword})
        // console.log(user)/////////////////////////////////
        return this.generateToken(user)

    }


    private async generateToken(user:User){
        const payload = {email:user.email, id:user.id, roles:user.UserRoles }
        return{
            token: this.jwtService.sign(payload)
        }
    }


    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);

        
        const passwordEquals = await bcrypt.compare(userDto.password, user[0].password);
        if (user[0] && passwordEquals) {
            // console.log(user)///////////////////////////////////////
            return user[0];
        }
        throw new UnauthorizedException({message: 'некорректный email или password'})  
    }
}

