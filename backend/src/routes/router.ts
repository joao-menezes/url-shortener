import express from "express";
import {
    deleteAllUrls,
    createShortUrl,
    deleteShortUrl,
    getAllUrls,
    redirectToOriginalUrl
} from "../controller/url.controller";

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/shorten", getAllUrls);

router.delete("/shorten/deleteAll", deleteAllUrls);

router.get("/shorten/:shortUrl", redirectToOriginalUrl);
router.delete("/shorten/:shortUrl", deleteShortUrl);


export default router;
