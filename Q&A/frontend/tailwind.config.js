/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend:{
    colors: {
      'mycolour':'#9F7AEA',
      'mycolour2':'#FEE2FE'
    },
    bgGradientDeg: {
      115: '115deg'
    },
    backgroundImage: {
      'register-image':"url('img/img.jpg')"
    },
  },
  },
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
          {
              'bg-gradient': (angle) => ({
                  'background-image': `linear-gradient(${angle}, var(--tw-gradient-stops))`,
              }),
          },
          {
              // values from config and defaults you wish to use most
              values: Object.assign(
                  theme('bgGradientDeg', {}), // name of config key. Must be unique
                  {
                      10: '10deg', // bg-gradient-10
                      15: '15deg',
                      20: '20deg',
                      25: '25deg',
                      30: '30deg',
                      45: '45deg',
                      60: '60deg',
                      90: '90deg',
                      120: '120deg',
                      135: '135deg',
                  }
              )
          }
       )
    })
  ],
}