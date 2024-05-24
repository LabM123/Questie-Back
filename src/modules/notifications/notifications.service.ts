import { Injectable } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
// import { Lesson } from "../lessons/entities/lesson.entity";
// import { Enrolment } from "../enrolments/entities/enrolment.entity";

@Injectable()
export class NotificationsService {
    constructor(
        private readonly mailService: MailService,
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        // @InjectRepository(Lesson) private readonly lessonsRepository: Repository<Lesson>,
        // @InjectRepository(Enrolment) private readonly enrolmentsRepository: Repository<Enrolment>,
    ){}

    @Cron("0 0 */3 * *")
    async usersPendingsCourses3DayNotification(){
        const allUsers = await this.usersRepository.find();
        allUsers.forEach((user)=>{
            this.mailService.sendMail(user.email, 'Reminder', 'Hi, you have pending courses to complete at Questie, do not miss the oportunity to acquire new knowkedge on anything you want.', null)
        })
    }
}