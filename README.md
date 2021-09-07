# volto-middleware-static

Volto middleware to serve dynamic static resources

Install with mrs-developer (see [Volto docs](https://docs.voltocms.com/customizing/add-ons/)) or simply with:

```bash
yarn add volto-middleware-static
```

Created with [voltocli](https://github.com/nzambello/voltocli).

## Usage

If you need to expose as a static resource a file or directory in your project, you can use this middleware when you want to serve those dynamically or don't have access to the `public` folder.

Let's say, for example, that you want to change the project favicon from an addon, so it's configurable and depending on the theme.
In your project's configuration, you can add something like:

```js
// webpack loaded resource -> gets you a link
// WARN: if this is a png or jpg, it will be served as base64 string if small
import favicon from '@package/components/layout/favicon.ico';

import { serveStaticResources } from 'volto-middleware-static';

if (__SERVER__) {
  config.settings.expressMiddleware = [
    ...config.settings.expressMiddleware,
    serveStaticResources({
      'favicon.ico': {
        url: favicon,
        contentType: 'image/ico',
      },
    }),
  ];
}
```

And then you'll have Volto serving your favicon and you can customize it from your code.

> **WARNING**: if you want to customize something existing in the `public` folder, you'll need to delete that from the static directory and handling that with this method.

So, `config.settings.staticFiles` accepts an object with the following structure:

- the `key` is the path of the file or directory to be served, corresponding to its URL
- as the `value` you can provide a `url` to the actual resource (from the webpack loader) and a `contentType` to specify the content type of the file to set as header for the browser
