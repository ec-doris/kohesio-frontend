import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  Req,
  UseGuards, UsePipes, ValidationPipe
} from "@nestjs/common";
import {Roles} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {EditService} from "./edit.service";
import {ApiTags} from "@nestjs/swagger";
import {BaseController} from "../base.controller";
import {EditInDTO, EditOutDTO, Status} from "./edit.dto";
import {DraftInDTO, DraftOutDTO} from "../drafts/draft.dto";
import {Role} from "../users/dtos/user.in.dto";

@Controller('/edits')
@ApiTags('Edits')
export class EditController extends BaseController{

  constructor(private editService: EditService){
    super();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Get('')
  async edits(@Req() req, @Query() filters: EditInDTO):Promise<EditOutDTO[] | void>{
    return await this.editService.getEdits(req.user.user_id, filters).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('')
  async submit(@Req() req, @Body() editInDTO: EditInDTO): Promise<EditOutDTO | void>{
    editInDTO.status = Status.SUBMITTED;
    return await this.editService.saveEdit(req.user.user_id,editInDTO).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id/approve')
  async approve(@Req() req, @Param('id') id: number): Promise<EditOutDTO | void>{
    return await this.editService.approve(req.user.user_id,id).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':id/reject')
  async reject(@Req() req, @Param('id') id: number): Promise<EditOutDTO | void>{
    return await this.editService.reject(req.user.user_id,id).catch(this.errorHandler);
  }

}
