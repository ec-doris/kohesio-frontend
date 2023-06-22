import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import {UserInDto} from "../users/dtos/user.in.dto";
import {UserDTO} from "../users/dtos/user.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userid:string): Promise<UserDTO>{
    return await this.userService.getUser(userid);
  }

  async updateUser(userdata:UserInDto): Promise<UserDTO>{
    return await this.userService.editUser(userdata.userid,userdata);
  }

}
