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
import {DraftDto} from "./dtos/draft.dto";
import {plainToInstance} from "class-transformer";
import {DraftInDto} from "./dtos/draft.in.dto";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/role.enum";
import {RolesGuard} from "../auth/roles.guard";
import {DraftService} from "./draft.service";
import {ApiTags} from "@nestjs/swagger";

@Controller('/drafts')
@ApiTags('Drafts')
export class DraftController {

  constructor(private draftService: DraftService){}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.Editor,Role.Reviewer)
  @Get(':id')
  async draft(@Req() req, @Param('id') draftId: number) {
    return await this.draftService.getDraft(req.user.user_id,draftId)
  }
  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.Editor,Role.Reviewer)
  @Get('')
  async drafts(@Req() req, @Param('qid') qId: string){
    return await this.draftService.getDrafts(req.user.user_id,qId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.Editor,Role.Reviewer)
  @Post('')
  async addDraft(@Req() req, @Body() draftDTO: any){
    return await this.draftService.addDraft(
      req.user.user_id,
      draftDTO.qid,
      draftDTO.label,
      draftDTO.summary,
      draftDTO.language).catch((err)=>{
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: err.data.detail,
      },HttpStatus.BAD_REQUEST);
    });
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.Editor,Role.Reviewer)
  @Put('/:id')
  async editUser(@Req() req, @Body() draftDTO: any, @Param('id') draftId: number){
    return await this.draftService.editDraft(
      req.user.user_id,
      draftId,
      draftDTO.qid,
      draftDTO.label,
      draftDTO.summary,
      draftDTO.language
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.Editor,Role.Reviewer)
  @Delete('/:id')
  async deleteUser(@Req() req,@Param('id') draftId: number){
    return await this.draftService.deleteDraft(req.user.user_id,draftId);
  }

}
