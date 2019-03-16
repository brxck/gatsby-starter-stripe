const Dotenv = require('dotenv-webpack')

console.log(process.env.NODE_ENV)

module.exports = {
  plugins: [
    new Dotenv({
      path: `./.env.development`
    })
  ]
}
