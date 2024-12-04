import {Injectable, Logger, StreamableFile} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {
  S3Client,
  S3ServiceException,
  paginateListObjectsV2, GetObjectCommand, NoSuchKey, S3
} from "@aws-sdk/client-s3";
import { Readable } from 'stream';


@Injectable()
export class DataService {

  private bucketName:string;
  private readonly logger = new Logger(DataService.name);

  constructor(private readonly httpService: HttpService,
              private readonly configService:ConfigService<environmentVARS>) {
    this.bucketName = this.configService.get("DATA_BUCKET_NAME");
  }

  async list(currentUser: string, path: any):Promise<any>{
    const client = new S3Client({
    });

    const objects = [];
    try {
      const paginator = paginateListObjectsV2(
        { client },
        { Bucket: this.bucketName, Prefix: `data/${path}`},
      );
      for await (const page of paginator) {
        objects.push.apply(objects,page.Contents.map((o) => o.Key));
      }
    } catch (caught) {
      if (
        caught instanceof S3ServiceException &&
        caught.name === "NoSuchBucket"
      ) {
        this.logger.error(
          `Error from S3 while listing objects for "${this.bucketName}". The bucket doesn't exist.`,
        );
      } else if (caught instanceof S3ServiceException) {
        this.logger.error(
          `Error from S3 while listing objects for "${this.bucketName}".  ${caught.name}: ${caught.message}`,
        );
      } else {
        this.logger.error("GENERAL ERROR", caught)
        throw caught;
      }
    }

    return objects;
  }

  async get(key:string):Promise<any>{

    return new Promise<any>(async (resolve, reject) => {
      const client = new S3Client({});
      try {
        const response = await client.send(
          new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }),
        );

        const file = new StreamableFile(response.Body as Readable);
        const keySplit = key.split("/");
        const fileName = keySplit[keySplit.length-2] + "_" + keySplit[keySplit.length-1]
        resolve({
          'ContentType': response.ContentType,
          'ContentDisposition': `attachment; filename="${fileName}"`,
          file: file
        });

      } catch (caught) {
        if (caught instanceof NoSuchKey) {
          this.logger.error(
            `Error from S3 while getting object "${key}" from "${this.bucketName}". No such key exists.`,
          );
        } else if (caught instanceof S3ServiceException) {
          this.logger.error(
            `Error from S3 while getting object from ${this.bucketName}.  ${caught.name}: ${caught.message}`,
          );
        } else {
          this.logger.error("GENERAL ERROR", caught)
          throw caught;
        }
      }
    });
  }

}
