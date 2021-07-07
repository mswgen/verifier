const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  purge: ['./assets/html/**/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: theme => ({
        'header':'#',
        'primary':'#141a23',
        'foreground':'#181e2a',
        'card': '#F5F5F7',
        ...theme(colors)
      }),
      colors: {
        teal: colors.teal
      },
      fontFamily: {
        sans: ['-apple-system', '"Apple SD Gothic Neo"', 'Ubuntu', '"Helvetica Neue"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif'],
        serif: ['-apple-system', '"Apple SD Gothic Neo"', 'Ubuntu', '"Helvetica Neue"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif'],
        mono: ['-apple-system', '"Apple SD Gothic Neo"', 'Ubuntu', '"Helvetica Neue"', '"Noto Sans KR"', '"Malgun Gothic"', 'sans-serif']
      },
      outline: {
        solidwhite: '1px solid white',
        solidblack: '1px solid black'
      }
    }
  },
  variants: {
    extend: {}
  }
}
