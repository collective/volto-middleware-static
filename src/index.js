import superagent from 'superagent';

const getResource = (url) =>
  new Promise((resolve, reject) => {
    try {
      superagent.get(url).end((err, result) => {
        if (err) resolve(result || err.message);
        else resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });

/**
 * Create a middleware to serve static files
 * @param {{[string]: {url: string, contentType: string}}} staticFiles - contains the static files to be served
 * @returns {express.IRouter} staticResourcesMiddleware
 */
export function serveStaticResources(staticFiles = {}) {
  // EXAMPLE:
  // {
  //   'favicon.ico': {
  //     url: favicon, // webpack loaded resource
  //     contentType: 'image/ico',
  //   },
  // };

  if (__SERVER__) {
    const express = require('express');

    const staticResourcesMiddleware = express.Router();
    staticResourcesMiddleware.id = 'volto-middleware-staticresources';
    staticResourcesMiddleware.all('**', async (req, res, next) => {
      Object.keys(staticFiles).forEach((f) => {
        if (req.originalUrl.includes(f)) {
          const url = staticFiles[f].url;
          getResource(url)
            .then((resource) => {
              res.set('Content-Type', staticFiles[f].contentType);
              res.set('Content-Disposition', `inline`);
              res.send(resource.body);
            })
            .catch((err) => res.status(400).send(err));
        }
      });

      next();
    });

    return staticResourcesMiddleware;
  }

  return {};
}

export default function applyConfig(config) {
  return config;
}
