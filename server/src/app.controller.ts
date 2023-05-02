import {Controller, Get, Session, Request, UseGuards, Query, Req, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";
import {LoginGuard} from "./auth/login.guard";
import {Response} from "express";

@Controller()
export class AppController {

  private readonly languages = ["bg","cs","da","de","el","es","et","fi","fr","ga","hr",
    "hu","it","lt","lv","mt","nl","pl","pt","ro","sk","sl","sv","en"];

  constructor(private readonly appService: AppService, private configService: ConfigService) {}

  @Get()
  async root(@Query('state') state, @Req() req, @Res() res: Response) {
    let acceptLanguage = req.acceptsLanguages(this.languages);
    if (!acceptLanguage){
      acceptLanguage = "en";
    }
    res.redirect(acceptLanguage);
  }

  @Get('/auth')
  auth(@Req() req, @Session() session: Record<string, any>): string {
    /*const environment = this.configService.get<string>('ENV');
    session.visits = session.visits ? session.visits + 1 : 1;
    return this.appService.getHello() + " environment: "+ environment + " visits: "+session.visits;*/
    //console.log("REQUEST",req);
    //console.log("SESSION",req.session);
    if (req.user) {
      return 'Hello, ' + req.user.user_id + '! <a href="/logout">Logout</a>';
    } else {
      return this.appService.getHello() + ' <a href="/login">Login</a>';
    }
  }
}
