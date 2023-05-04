import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Session,
  UseGuards
} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserDTO} from "./dtos/user.dto";
import {plainToInstance} from "class-transformer";
import {UserInDto} from "./dtos/user.in.dto";
import {LoginGuard} from "../auth/login.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/role.enum";
import {RolesGuard} from "../auth/roles.guard";

@Controller('/user')
export class UserController {

  constructor(private userService: UserService){}

  @Get('')
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
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('/users')
  async users(){
    const usersIn:UserInDto[] = await this.userService.getUsersList();
    const usersDTO:UserDTO[] = plainToInstance(UserDTO, usersIn);
    return usersDTO;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('')
  async addUser(@Body() userDTO: any){
    return await this.userService.addUser(userDTO.userid,userDTO.role,userDTO.active).catch((err)=>{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: err.data.detail,
      },HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Put('/users/:id')
  async editUser(@Body() userDTO: any, @Param('id') id: string){
    return await this.userService.editUser(id,userDTO.role,userDTO.active);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete('/users/:id')
  async deleteUser(@Param('id') id: string){
    return await this.userService.deleteUser(id);
  }

}
