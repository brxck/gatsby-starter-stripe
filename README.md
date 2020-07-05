# gatsby-starter-stripe

A starter to create and manage a storefront with [Gatsby](https://www.gatsbyjs.org/), [Stripe](https://stripe.com/), & [Netlify Functions](https://www.netlify.com/docs/functions/); includes cart, checkout, admin, and live data.

## Features

- Create and manage inventory through admin interface
- Statically generate based on Stripe inventory
- Dynamically update with live inventory & availability data
- Checkout powered by Stripe
- Serverless functions interact with Stripe API

## Getting Started

1. **Create a new site from this starter**

   ```sh
   gatsby new <project-name> https://github.com/brxck/gatsby-starter-stripe
   ```

2. **Setup Stripe**

   This starter has an admin interface to manage your inventory, but the Stripe integration does not handle an empty account well. Before starting your site, you should create at least one product with one sku in Stripe.

   > :warning: `Cannot query field` errors usually mean that a queried field is empty in all of your products/skus. Either define the field in your Stripe data, or remove it from the the GraphQL queries of allStripeSku.

3. **Configure API keys**

   Rename `.env.example` to `.env` and fill with your Stripe API test keys. **Don't commit this file to a public repo!**

4. **Start development servers**

   You will need to install and configure the [Netlify CLI](https://docs.netlify.com/cli/get-started/): `npm install netlify-cli -g`

   To start the development servers for Gatsby & [Netlify Functions](https://github.com/netlify/netlify-lambda#usage) simply run [Netlify Dev](https://www.netlify.com/products/dev).

   ```sh
   netlify dev
   ```

   Your site is accessible at `http://localhost:8888`!

   > :warning: Make sure to use the proxied _Netilfy Dev_ server at `:8888`! Otherwise your Gatsby application will not be able to access your Netlify Functions.

5. **Start developing**

   This starter aims to handle some of the plumbing needed to integrate Gatsby & Stripe. Everything else is left to you and your preferred methods.

   The source files for [Netlify Functions](https://www.netlify.com/docs/functions/) are located at `/src/functions`, they are then built into the files in `/functions`. Visit the documentation for more information on their structure.

6. **Deploy to [Netlify](https://www.netlify.com/docs)**

   ```sh
   netlify deploy
   ```

   You will need to enable Netlify Identity for authentication into the admin area.

   > If you want to deploy somewhere other than Netlify, you'll have to find another place to deploy the serverless functions in `/functions`, ex. AWS Lambda.

## Contributing

Issues and pull requests welcome!

## Acknowledgments

Thanks @njosefbeck for authoring and maintaining [gatsby-source-stripe](https://github.com/njosefbeck/gatsby-source-stripe), which makes this starter possible!
