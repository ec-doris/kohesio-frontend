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
import {DraftService} from "./draft.service";
import {ApiTags} from "@nestjs/swagger";
import {BaseController} from "../base.controller";
import {DraftInDTO, DraftOutDTO} from "./draft.dto";
import {Role} from "../users/dtos/user.in.dto";

@Controller('/drafts')
@ApiTags('Drafts')
export class DraftController extends BaseController{

  constructor(private draftService: DraftService){
    super();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Get(':id')
  async draft(@Req() req, @Param('id') draftId: number):Promise<DraftOutDTO | void> {
    return await this.draftService.getDraft(req.user.user_id,draftId).catch(this.errorHandler);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Get('')
  async drafts(@Req() req, @Query('qid') qId: string):Promise<DraftOutDTO[] | void>{
    return await this.draftService.getDrafts(req.user.user_id,qId).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('')
  async addDraft(@Req() req, @Body() draftInDTO: DraftInDTO): Promise<DraftOutDTO | void>{
    return await this.draftService.addDraft(req.user.user_id,draftInDTO).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/:id')
  async editDraft(@Req() req, @Body() draftInDTO: DraftInDTO, @Param('id') draftId: number): Promise<DraftOutDTO | void>{
    return await this.draftService.editDraft(req.user.user_id,draftId,draftInDTO).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Delete('/:id')
  async deleteUser(@Req() req,@Param('id') draftId: number):Promise<boolean | void>{
    return await this.draftService.deleteDraft(req.user.user_id,draftId).catch(this.errorHandler);
  }

}
