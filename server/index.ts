import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

const document = readFileSync(__dirname + '/index.html', 'utf8').toString();
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(__dirname + '/dist-server/main.bundle').AppServerModuleNgFactory;
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

enableProdMode();

// Express server
const app = express();
app.get('**', (req, res) => {
    const url = req.path;
    renderModuleFactory(AppServerModuleNgFactory, {
        document: document,
        url: url,
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP)
        ]
    })
    .then(html => {
        res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
        res.send(html);
    });
});

export let ssrapp = functions.https.onRequest(app);
