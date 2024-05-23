import { BadRequestException, Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'
import * as sgTransport from 'nodemailer-sendgrid-transport';

@Injectable()
export class MailService{
    private transporter: nodemailer.Transporter

    constructor(){
        this.transporter = nodemailer.createTransport(
            sgTransport({
                auth: {
                    api_key: process.env.SENDGRID_API_KEY
                }
            })
        )
    }

    async sendMail(to: string, subject: string, text: string, html?: string){
        const mailOptions = {
            from: 'questieproyect@gmail.com',
            to,
            subject,
            text,
            html
        }
        try {
            await this.transporter.sendMail(mailOptions)
        } catch (error: any) {
            throw new BadRequestException(error.message)
        }
    }
}