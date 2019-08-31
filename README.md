# gatsby-starter-stripe

A minimal starter to create a storefront with [Gatsby](https://www.gatsbyjs.org/), [Stripe](https://stripe.com/), & [Netlify Functions](https://www.netlify.com/docs/functions/). This starter focuses on handling Stripe integration, and letting you handle the rest however you'd like.

## Features

- Statically generate based on Stripe inventory
- Dynamically update with live inventory & availability data
- Checkout powered by Stripe
- Serverless functions interact with Stripe API
- Shopping cart persists in local storage
- Responsive images with gatsby-image

The ProductsProvider component provides normalized Product and Sku data sourced from Gatsby's GraphQL store and the live Stripe API, while the CartProvider manages the cart, its persistence in local storage, and checkout.

## Getting Started

1. **Create a site with Gatsby**

   ```sh
   gatsby new <project-name> https://github.com/brxck/gatsby-starter-stripe
   ```

2. **Setup Stripe**

   Create your Products within Stripe. Each Product should have at least one Sku.

   The GraphQL [query in the ProductsProvider](https://github.com/brxck/gatsby-starter-stripe/blob/master/src/components/ProductsProvider.js#L111) lists the properties that Gatsby will expect to find on your Products & Skus. The `localFiles` field is created by `gatsby-source-stripe`, and `fields.slug` is created by the starter in `gatsby-node`.

3. **Configure API keys**

   Rename `.env.development.sample` to `.env.development` and fill with your Stripe API test keys. Do the same for `.env.production` and your live API keys. **Don't commit these files to a public repo!**

4. **Start development servers**

   There are two development servers for this project:

   1. `gatsby serve` for our Gatsby site
   2. `netlify-lambda serve functions` for our [Netlify Functions](https://github.com/netlify/netlify-lambda#usage)

   You will probably want to start both at once:

   ```sh
   npm run start
   ```

   Your site is accessible at `http://localhost:8000` and your Netlify Functions are accessible at `http://localhost:8000/.netlify/`.

   > Note: try deleting the cache (`rm -rf .cache`) if Gatsby's dev server fails to start.

5. **Start developing**

   This starter aims to handle some of the plumbing needed to integrate Gatsby & Stripe. Everything else (ex. styling) is left to you and your preferred methods.

   The source files for [Netlify Functions](https://www.netlify.com/docs/functions/) are located at `/src/functions`, they are then built into the files in `/functions`. Visit the documentation for more information on their structure.

   The `ProductsProvider` & `CartProvider` components centralize data & logic, which are then passed through React's [Context API](https://reactjs.org/docs/context.html). The starter's components are written using [Hooks](https://reactjs.org/docs/hooks-intro.html).

6. **Deploy to [Netlify](https://www.netlify.com/docs)**

   If you want to deploy somewhere other than Netlify, you'll have to find another place to deploy the serverless functions in `/functions`, ex. AWS Lambda.

## Contributing

Issues and pull requests welcome!

## Acknowledgments

Thanks @njosefbeck for authoring and maintaining [gatsby-source-stripe](https://github.com/njosefbeck/gatsby-source-stripe), which makes this starter possible!
