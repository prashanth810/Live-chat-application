import Archject from '../config/arch jet/Archjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

const Archjectmiddleware = async (req, res, next) => {
    try {
        const decision = await Archject.protect(req);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ succcess: false, message: "Rate limit reached pls try again !!!" });
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ succcess: false, message: "Bot access denied !!!" });
            }
        }

        else {
            return res.status(403).json({ succcess: false, message: "Access denied by security policy !!!" });
        }

        if (decision.results.some(isSpoofedBot())) {
            return res.status(403).json({ succcess: false, error: "Spoofed bot dected !!!", message: "Malicious bot activity dected !!!" });
        }
        next();
    }

    catch (error) {
        res.status(500).json({ succcess: false, message: error.message })
    }
}

export default Archjectmiddleware;