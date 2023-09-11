import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import {Roles} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {NotificationService} from "./notification.service";
import {ApiTags} from "@nestjs/swagger";
import {BaseController} from "../base.controller";
import {Role} from "../users/dtos/user.in.dto";
import {NotificationInDTO, NotificationOutDTO} from "./notification.dto";


@Controller('/notifications')
@ApiTags('Notifications')
export class NotificationController extends BaseController{

  constructor(private notificationService: NotificationService){
    super();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('')
  async listNotifications(@Req() req, @Body() params:NotificationInDTO):Promise<NotificationOutDTO[] | {} | void>{
    return await this.notificationService.getNotifications(req.user.user_id, params.seen).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Get('mark-as-read/:id')
  async markAsRead(@Req() req, @Param('id') id:string):Promise<string | {} | void>{
    return await this.notificationService.markAsRead(req.user.user_id, id).catch(this.errorHandler);
  }



}
