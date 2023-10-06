import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import {UserInDto} from "../users/dtos/user.in.dto";
import {UserDTO} from "../users/dtos/user.dto";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(userid:string): Promise<UserDTO>{
    return await this.userService.validateUser(userid);
    //console.log("VALIDATE_USER",userDB);
    /*if (!userDB.active ||
      (userDB.expiration_time && (new Date(userDB.expiration_time) < new Date))){
      return undefined;
    }else {
      return userDB;
    }*/
  }

  async updateUser(userdata:UserInDto): Promise<UserDTO>{
    return await this.userService.editUser(userdata.userid,userdata);
  }

  async loginUser(userid:string):Promise<boolean>{
    return await this.userService.loginUser(userid);
  }

}
