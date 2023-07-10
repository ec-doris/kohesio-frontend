import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import {Roles} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {EditService} from "./edit.service";
import {ApiTags} from "@nestjs/swagger";
import {BaseController} from "../base.controller";
import {EditInDTO, EditOutDTO, EditVersionDTO, EditVersionInDTO, Status} from "./edit.dto";
import {Role} from "../users/dtos/user.in.dto";


@Controller('/edits')
@ApiTags('Edits')
export class EditController extends BaseController{

  constructor(private editService: EditService){
    super();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('')
  async listEdits(@Req() req, @Query() filters: EditInDTO):Promise<EditOutDTO[] | {} | void>{
    return await this.editService.getEdits(req.user.user_id, filters).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/get/:id')
  async getEdit(@Req() req, @Param("id") id: number):Promise<EditOutDTO | {} | void>{
    return await this.editService.getEdit(req.user.user_id, id).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('version')
  async listVersions(@Req() req, @Query() filters: EditInDTO):Promise<EditOutDTO | {} | void>{
    filters.latest_status = [Status.DRAFT,Status.SUBMITTED];
    const edits:EditOutDTO[] | void = await this.editService.getEdits(req.user.user_id, filters).catch(this.errorHandler);
    if (edits && edits.length){
      for (const edit of edits) {
        return await this.editService.getEdit(req.user.user_id, edit.id);
      }
    }
    return {};
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('version')
  async createVersion(@Req() req, @Body() editVersionInDTO: EditVersionInDTO):Promise<EditVersionDTO | void>{
    //editVersionInDTO.status = Status.DRAFT;
    return await this.editService.saveEdit(req.user.user_id,editVersionInDTO).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Get('version/:id')
  async getVersion(@Req() req, @Param("id") editVersionId: number):Promise<EditVersionDTO | void>{
    return await this.editService.getEditVersion(req.user.user_id, editVersionId).catch(this.errorHandler);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN,Role.EDITOR,Role.REVIEWER)
  @Delete('version/:id')
  async deleteVersion(@Req() req, @Param("id") editVersionId: number):Promise<boolean | void>{
    return await this.editService.deleteEditVersion(req.user.user_id, editVersionId).catch(this.errorHandler);
  }



}
