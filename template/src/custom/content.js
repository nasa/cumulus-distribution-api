var fs = require('fs');

/**
 * This file exports the content of your website, as a bunch of concatenated
 * Markdown files. By doing this explicitly, you can control the order
 * of content without any level of abstraction.
 *
 * Using the brfs module, fs.readFileSync calls in this file are translated
 * into strings of those files' content before the file is delivered to a
 * browser: the content is read ahead-of-time and included in bundle.js.
 */
module.exports =

  '# Introduction\n' +
  fs.readFileSync('./content/introduction.md', 'utf8') + '\n' +

  '# Versioning\n' +
  fs.readFileSync('./content/version.md', 'utf8') + '\n' +

  '# Data Access\n' +
  fs.readFileSync('./content/distribution.md', 'utf8') + '\n' +

  '# Authentication\n' +
  fs.readFileSync('./content/auth.md', 'utf8') + '\n' +

  '# Bucket Map\n' +
  fs.readFileSync('./content/bucketmap.md', 'utf8') + '\n' +

  '# S3 Access\n' +
  fs.readFileSync('./content/s3credentials.md', 'utf8') + '\n' +

  '# S3 Access README\n' +
  fs.readFileSync('./content/s3credentialsreadme.md', 'utf8') + '\n';
