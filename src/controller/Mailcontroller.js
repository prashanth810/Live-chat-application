
import SignUpTemplate from "../emails/SignUptemplate.js";
import Envs from "../envs/Envs.js";
import MailModel from "../model/MailModel.js";

export const sendSignUpMail = async (to, name, res, frontend) => {
    try {
        await MailModel.sendMail({
            from: `${name} <${Envs.USER_MAIL}> `,
            to,
            subject: "Welcome to Live Chat 🎉",
            html: SignUpTemplate(name, frontend),
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
        console.log("❌ Mail sending failed:", error.message);
    }
};
