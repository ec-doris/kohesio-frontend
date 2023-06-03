import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import {UserInDto} from "../users/dtos/user.in.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userid:string): Promise<UserInDto>{
    return await this.userService.getUser(userid);
  }

}
