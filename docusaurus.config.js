module.exports = {
  title: 'ADURC',
  tagline: 'The tagline of my site',
  url: 'https://adurc.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'adurc', // Usually your GitHub org/user name.
  projectName: 'Adurc', // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: 'Adurc Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/getting-started/quickstart',
          activeBasePath: 'docs/getting-started',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: 'docs/concepts/overview/what-is-adurc',
          activeBasePath: 'docs/concepts',
          label: 'Concepts',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/adurc/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/getting-started/quickstart',
            },
            {
              label: 'Adurc Concepts',
              to: 'docs/concepts/overview/what-is-adurc',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/adurc',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/adurc',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/adurc',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/adurc/docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Adurc, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        'docs': {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/adurc/docs/edit/main/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
