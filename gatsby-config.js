const execSync = require('child_process').execSync;

const date = new Date().toISOString().substr(0, 16).replace('T', ' ') + ' UTC';
const version = 'capella';
const hostname = 'https://eth2book.info';
const canonical = hostname + '/latest';

function getGitHash() {
  try {
    return execSync('git log -1 --format="%h" 2>/dev/null', {encoding: 'utf8'}).replace(/(\r\n|\n|\r)/, '')
  } catch(e) {
    return 'unknown'
  }
}

module.exports = {
  siteMetadata: {
    title: 'Upgrading Ethereum',
    description: 'A technical handbook on Ethereum\'s move to proof of stake and beyond',
    author: 'Ben Edgington',
    gitHash: getGitHash(),
    gitUrl: 'https://github.com/benjaminion/upgrading-ethereum-book',
    date: date,
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    licence: 'CC BY-SA 4.0',
    hostname: hostname,
    version: version,
    canonical: canonical,
  },
  pathPrefix: '/' + version,
  trailingSlash: 'always',
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-pages',
        path: `${__dirname}/src/md`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        gfm: true,
        plugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              elements: ['h3', 'h4', 'h5', 'h6'],
            },
          },
          'gatsby-remark-numbered-footnotes',
          'gatsby-remark-katex',
          {
            resolve: 'my-tooltips',
            options: {
              file: `${__dirname}/src/constants.json`,
            }
          },
          {
            resolve: 'my-svg-embed',
            options: {
              directory: `${__dirname}/src/`,
            }
          },
          'my-strip-html-comments',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
              aliases: {code: 'text'},
            },
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-plugin-htaccess',
      options: {
        ErrorDocument: 'ErrorDocument 404 /' + version + '/404.html',
      },
    },
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: '1',
        matomoUrl: hostname + '/matomo',
        siteUrl: hostname + '/' + version,
        matomoPhpScript: 'matomo.php',
        matomoJsScript: 'matomo.js',
        disableCookies: true,
      },
    },
    {
      resolve: 'my-search-index',
      options: {
        enabled: true,
        // Matching elements have their text added to the index. First match wins.
        chunkTypes: [
          {query: 'figcaption', label: 'Figure caption'},
          {query: '[id^="fn-"]', label: 'Footnote'},
          {query: 'li', label: 'List item'},
          {query: 'pre', label: 'Code'},
          {query: 'table', label: 'Table'},
          {query: 'h3, h4, h5, h6', label: 'Heading', weight: 5},
          {query: 'p', label: 'Paragraph'},
        ],
        exclude: {
          // Note, only pages under src/md/pages have a "hide" property.
          frontmatter: [{hide: true}, {hide: null}],
          // The frontmatter filter takes care of excluding a good set of pages for now.
          pages: [],
          // Elements matching this query are ignored completely, including their text:
          ignore: 'svg, details, mtable, mrow, [aria-hidden="true"], .footnote-ref',
        }
      },
    }
  ],
  flags: {},
};
