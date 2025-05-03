import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Url } from "../schemas/url.schema";

export const getAllUrls = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);

        const totalUrls = await Url.countDocuments();

        const urls = await Url.find()
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        const totalPages = Math.ceil(totalUrls / limitNumber);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages,
            totalUrls,
            urls
        });
    } catch (e) {
        res.status(500).send("Erro ao recuperar URLs.");
    }
};


export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            res.status(400).json({ error: "URL original é obrigatória" });
            return
        }

        const shortUrl = nanoid(8);
        const newUrl = new Url({ originalUrl, shortUrl });

        await newUrl.save();
        res.status(201).json({ originalUrl, shortUrl });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar URL encurtada" });
    }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });
        if (!url) {
            res.status(404).json({ error: "URL não encontrada" });
        } else {
            res.redirect(url.originalUrl);
            return
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar URL" });
    }
};

export const deleteShortUrl = async (req: Request, res: Response) => {
    try {
        const { shortUrl } = req.params;

        const url = await Url.deleteOne({ shortUrl });

        if (url.deletedCount === 0) {
            res.status(404).send("URL not found");
            return;
        }

        res.status(200).send(url);
        return;
    }catch (e) {
        res.status(500).send("Internal Server Error");
    }

}

export const deleteAllUrls = async (req: Request, res: Response) => {
    try {
        // const oneDayAgo = new Date(new Date().getTime() - 86400000);
        const result = await Url.deleteMany();
        console.log(`URLs expiradas apagadas:}`);
        res.status(200).json({ message: `Todas as URLs foram deletadas com sucesso. ${result.deletedCount}`});
    } catch (error) {
        res.status(500).json({ message: "Erro interno ao deletar as URLs." });
    }
};