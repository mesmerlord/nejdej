/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 * @type {import('next').NextConfig}
 */
const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  experimental: {
    outputStandalone: true,
  },
});
