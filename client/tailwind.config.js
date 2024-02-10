/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        mainBg:"#322654",
        lightBg:"#3b2e61"
      }
    },
    keyframes:{
      rotation:{
        '0%, 100%':{transform:'rotate(0deg)'},
        '50%':{transform:'rotate(180deg)'}
      }
    },
    animation:{
      "rotateAnimate":"rotation 2s ease infinite"
    },
    fontFamily:{
      AR_One_Sans: [ 'AR One Sans' ],
      Abel: [ 'Abel' ],
      Amaranth: [ 'Amaranth' ],
      Anton: [ 'Anton' ],
      Arsenal: [ 'Arsenal' ],
      Barlow: [ 'Barlow' ],
      Bruno_Ace_SC: [ 'Bruno Ace SC' ],
      Comfortaa: [ 'Comfortaa' ],
      Comforter: [ 'Comforter' ],
      Ephesis: [ 'Ephesis' ],
      Jost: [ 'Jost' ],
      Maven_Pro: [ 'Maven Pro' ],
      Oxygen: [ 'Oxygen' ],
      PT_Sans_Narrow: [ 'PT Sans Narrow' ],
      Palanquin: [ 'Palanquin' ],
      Philosopher: [ 'Philosopher' ],
      Quicksand: [ 'Quicksand' ]
    },
   
  },
  plugins: [],
}