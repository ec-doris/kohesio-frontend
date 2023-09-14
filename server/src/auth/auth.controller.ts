import {
  Controller,
  Get,
  Request,
  Res, Req, Session,
  UseGuards, Query, Param, HttpStatus, HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginGuard } from './login.guard';
import {ConfigService} from "@nestjs/config";
import {AuthService} from "./auth.service";
import {UserService} from "../users/user.service";
import {BaseController} from "../base.controller";

@Controller()
export class AuthController extends BaseController{

  constructor(private configService:ConfigService<environmentVARS>,
              private authService: AuthService,
              private userService: UserService){
    super();
  }


/*  @Get('/')
  root(@Query('state') state,@Req() req, @Res() res) {
    console.log("USER",req.user);
    console.log("SESSION",req.session);
    if (state){
      res.redirect(state);
    }else{
      res.end('welcome to the session demo. refresh!')
    }
  }*/

  @UseGuards(LoginGuard)
  @Get('/login')
  login(@Query('callback') callback) {
  }

  @Get('/keepAlive')
  refresh(@Req() req){
    return {refresh:true}
  }

  @Get('/session')
  sessionTest(@Req() req, @Res() res){
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      const hour = 60000; //1 minute
      req.session.cookie.expires = new Date(Date.now() + hour)
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  }

  @UseGuards(LoginGuard)
  @Get('/loginCallback')
  async loginCallback(@Query('state') state, @Req() req, @Res() res: Response) {
    //console.log("STATE",state);
    //await this.authService.validateUser(req.user.userinfo);
    //console.log("USER",req.user);
    //const userDB:UserInDto = await this.authService.validateUser(req.user.userinfo.uid);
    //console.log("USERDB = ", userDB);
    res.redirect(state);
  }

  @Get('/logout')
  async logout(@Query('callback') callback, @Session() session: Record<string, any>,@Request() req, @Res() res: Response) {
    //const id_token = session.passport.user ? session.passport.user.id_token : undefined;
    if (req.session.passport.user.impersonateUser){
      req.session.passport.user = req.session.passport.user.originalUser;
      res.redirect('/');
    }else {
      req.logout(() => {
        req.session.destroy(async (error: any) => {
          /*const TrustIssuer = await Issuer.discover(`${this.configService.get<string>('OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER')}/.well-known/openid-configuration`);
          const end_session_endpoint = TrustIssuer.metadata.end_session_endpoint;
          if (end_session_endpoint) {
            res.redirect(end_session_endpoint +
              '?post_logout_redirect_uri=' + this.configService.get<string>('OAUTH2_CLIENT_REGISTRATION_LOGIN_POST_LOGOUT_REDIRECT_URI') +
              (id_token ? '&id_token_hint=' + id_token : ''));
          } else {
            res.redirect('/')
          }*/
          res.redirect(callback);
        })
      });
    }
  }

  @Get('/invitation/:token')
  async invitation(@Req() req, @Res() res: Response, @Param("token")token:string) {
    console.log("accepting the invitation",token)
    const redirectURL = '/api/login?callback=/api/invitation/'+token;
    if (req.user){
      req.logout(() => {
        req.session.destroy(async (error: any) => {
          res.redirect(redirectURL);
        })
      })
    }else {
      res.redirect(redirectURL);
    }
  }

}
