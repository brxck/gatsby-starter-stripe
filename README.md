# gatsby-starter-stripe

A minimal starter to create a storefront with [Gatsby](https://www.gatsbyjs.org/), [Stripe](https://stripe.com/), & [Netlify Functions](https://www.netlify.com/docs/functions/).

## Features

- Live inventory & availability
- Netlify Functions to interact with Stripe
- Shopping cart with checkout & persistence
- Product pages
- Responsive images with gatsby-image

## Getting Started

1. **Create a site with Gatsby**

    ```sh
    gatsby new <project-name> https://github.com/brxck/gatsby-starter-stripe
    ```

2. **Configure API keys**

    Rename `.env.sample` to `.env` and fill with your Stripe API keys. **Don't commit this file to a public repo!**

3. **Start development servers**

    There are two development servers for this project:

    1. `gatsby serve` for our Gatsby site
    2. `netlify-lambda serve functions` for our [Netlify Functions](https://github.com/netlify/netlify-lambda#usage)

    You will probably want to start both at once:

    ```sh
    npm run start
    ```

    Your site is accessible at `http://localhost:8000` and your Netlify Functions are accessible at `http://localhost:8000/.netlify/`.

    > Note: try deleting the cache (`rm -rf .cache`) if Gatsby's dev server fails to start.


4. **Start developing**

    This starter aims to handle some of the plumbing needed to integrate Gatsby & Stripe. Everything else (ex. styling) is left to you and your preferred methods.

    The source files for [Netlify Functions](https://www.netlify.com/docs/functions/) are located at `/src/functions`, they are then built into the files in `/functions`. Visit the documentation for more information on their structure.
    
    The `ProductsProvider` & `CartProvider` components centralize  data & logic, which are then passed through React's [Context API](https://reactjs.org/docs/context.html). The starter's components are written using [Hooks](https://reactjs.org/docs/hooks-intro.html).
    

5. **Deploy to [Netlify](https://www.netlify.com/docs)**
    
    If you want to deploy somewhere other than Netlify, you'll have to find another place to deploy the serverless functions in `/functions`, ex. AWS Lambda.
