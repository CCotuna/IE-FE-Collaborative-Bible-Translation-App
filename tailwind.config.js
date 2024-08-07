module.exports = {
  content: [
   "./app/**/*.{vue,js,ts,jsx,tsx,mdx}",
   "./pages/**/*.{vue,js,ts,jsx,tsx,mdx}",
   "./components/**/*.{vue,js,ts,jsx,tsx,mdx}",

   // Or if using `src` directory:
   "./src/**/*.{vue,js,ts,jsx,tsx,mdx}",
 ],
 theme: {
   extend: {
    colors: {
      'brand': {
        'gold-metallic' : '#E2B84F',
        'cornsilk' : '#FFF7D6',
        'custom-white' : '#FFFDFB',
        'honeydew' : '#E7F3DD',
        'olivine' : '#85B56F',
        'tea-green' : '#C1E4AD'
      }
    }
   },
 },
 variants: {
   extend: {},
 },
 plugins: [],
}