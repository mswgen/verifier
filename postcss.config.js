module.exports = {
  map: process.env.NODE_ENV == 'development',
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    process.env.NODE_ENV == 'production' ? require('cssnano') : false
  ]
}