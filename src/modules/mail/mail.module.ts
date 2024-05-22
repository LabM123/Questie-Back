import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

@Module({
    controllers: [],
    providers: [MailService],
})
export class MailModule {}