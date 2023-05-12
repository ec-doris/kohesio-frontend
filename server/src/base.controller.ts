import {HttpException, HttpStatus} from "@nestjs/common";

export class BaseController{

  public errorHandler(err){
    if (err.status == 404){
      throw new HttpException({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        error: "Service is unavailable",
      }, HttpStatus.SERVICE_UNAVAILABLE);
    }else {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: "Requested object not found",
      }, HttpStatus.BAD_REQUEST);
    }
  }


}
