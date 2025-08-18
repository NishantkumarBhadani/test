import { Router } from "express";
import { validateUrl } from "../middlewares/validate.middlewares.js";
import { shortUrl,redirect } from "../controller/url.controller.js";

const router = Router();

router.route("/short").post(validateUrl, shortUrl);
router.route("/:shortUrl").get(redirect);

export default router;