/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env.config";
import path from "path";
import ejs from "ejs";
import { AppError } from "../errors/AppError";

const transport = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    }
});

interface IEmail {
    to: string;
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string;
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendMail = async ({ to, subject, templateName, templateData, attachments }: IEmail) => {
    if (!to || !subject || !templateName) {
        throw new AppError(400, "Missing required email parameters.");
    };

    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData || {});
        await transport.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });
        // console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        // console.error("Email sending error:", error);
        throw new AppError(500, "Failed to send email.", error);
    }
};