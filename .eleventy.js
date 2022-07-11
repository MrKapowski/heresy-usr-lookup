const fs = require('fs');
const htmlmin = require('html-minifier');
const MarkdownIt = require('markdown-it');

module.exports = function (config) {
  config.setLiquidOptions({
    dynamicPartials: true,
  });

  // Static assets to pass through
  config.addPassthroughCopy('./src/images');
  config.addPassthroughCopy('./src/public');
  config.addPassthroughCopy('./src/styles');
  config.addPassthroughCopy('./src/main.js');

  const mdRender = new MarkdownIt();
  config.addFilter('mdDescription', function (rawString) {
    return JSON.stringify(mdRender.render(rawString));
  });
  config.addFilter('markdown', function (rawString) {
    return mdRender.render(rawString);
  });
  config.addFilter('sortRules', function (arr) {
    return arr.sort((first, second) => {
      return first.name < second.name ? -1 : first.name > second.name ? 1 : 0;
    });
  });

  config.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV == 'production' &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'md', 'liquid'],
    htmlTemplateEngine: 'liquid',
    dataTemplateEngine: 'liquid',
    markdownTemplateEngine: 'liquid',
  };
};
