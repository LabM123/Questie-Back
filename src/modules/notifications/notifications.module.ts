import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { MailService } from "../mail/mail.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Lesson } from "../lessons/entities/lesson.entity";
import { Enrolment } from "../enrolments/entities/enrolment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Lesson, Enrolment])],
    controllers: [],
    providers: [NotificationsService, MailService],
})
export class NotificationsModule {}