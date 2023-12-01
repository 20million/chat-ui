// Extend Request type to include protocol property
declare module 'express' {
    interface Request {
        secure: boolean;
        headers: any;
        url: string;
    }
    interface Response {
        redirect(url: string): void;
        redirect(status: number, url: string): void;
        redirect(url: string, status: number): void;
        end(): any;
    }
}

// server.ts
import { handler } from '../build/handler.js';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

const privateKey = fs.readFileSync('./crt/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./crt/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();

// Custom middleware for HTTP to HTTPS redirection
const redirectHttpToHttps = (req: Request, res: Response, next: NextFunction) => {
    const redirectTo = `https://${req.headers?.host}${req.url}`;
    if (!req.secure) {
        console.log(`Redirect HTTP to ${redirectTo}`);
        res.redirect(301, redirectTo);
    } else {
        next();
    }
};

// Apply middleware for HTTP to HTTPS redirection
app.use(redirectHttpToHttps);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const PORT = 80;
const SSLPORT = 443;

httpServer.listen(PORT, () => {
    console.log(`HTTP Server is running on: http://localhost:${PORT}`);
});

httpsServer.listen(SSLPORT, () => {
    console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`);
});

// Add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req: Request, res: Response) => {
    res.end();
});

// Let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);
