module.exports = {
  siteMetadata: {
    title: `starter-stripe`,
    description: `Stripe storefront starter for Gatsby`,
    author: `Brock McElroy <brxck.dev>`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ["Product", "Sku"],
        secretKey: process.env.STRIPE_SECRET_KEY,
        downloadFiles: true,
        auth: false,
      },
    },
  ],
}
