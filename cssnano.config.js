module.exports = {
  preset: [
    require('cssnano-preset-default'),
    {
      discordComments: {
        removeAll: true
      }
    }
  ]
}