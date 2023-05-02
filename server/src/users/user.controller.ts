import {Controller, Get, Req, Session} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserDTO} from "./dtos/user.dto";
import {instanceToInstance, plainToInstance} from "class-transformer";

@Controller()
export class UserController {

  constructor(private userService: UserService){}

  @Get('/user')
  async user(@Req() req) {
    //console.log("COOKIES",req.cookies);
    if (req.user){
      //const userDB:User = await this.userService.findByUid(req.user.userinfo.sid).then();
      const userDTO:UserDTO = plainToInstance(UserDTO, req.user as Object);
      return userDTO;
    }else{
      return {};
    }
  }

}
