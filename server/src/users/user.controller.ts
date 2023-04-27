import {Controller, Get, Req, Session} from "@nestjs/common";
import {UserService} from "./user.service";

@Controller()
export class UserController {

  constructor(private userService: UserService){}

  @Get('/user')
  async user(@Req() req) {
    //console.log("COOKIES",req.cookies);
    if (req.user){
      //const userDB:User = await this.userService.findByUid(req.user.userinfo.sid).then();
      //const userDTO:UserDTO = plainToInstance(UserDTO, userDB, { excludeExtraneousValues: true });
      return req.user.userinfo;
    }else{
      return {};
    }
  }

}
