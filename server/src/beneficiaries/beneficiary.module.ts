import { Module } from '@nestjs/common';
import {BeneficiaryController} from "./beneficiary.controller";
import {BeneficiaryService} from "./beneficiary.service";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";
import {EditService} from "../edits/edit.service";

@Module({
  providers: [BeneficiaryService, EditService],
  exports: [BeneficiaryService],
  controllers: [BeneficiaryController],
  imports: [HttpModule,ConfigModule.forRoot()],
})
export class BeneficiaryModule {}
