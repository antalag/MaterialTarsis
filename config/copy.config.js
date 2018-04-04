// New copy task for font files
module.exports = {
  copyFontAwesome: {
    src: ['{{ROOT}}/node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/**/*'],
    dest: '{{WWW}}/assets/fonts'
  },
//  copyGoogleService:{
//      src:['{{ROOT}}/google-services.json'],
//      dest:'{{ROOT}}/platforms/android'
//  },
//  copyAppCache:{
//      src:['{{ROOT}}/src/manifest.appcache'],
//      dest:'{{ROOT}}/www'
//  },
//  copyMainHtml:{
//      src:['{{ROOT}}/src/main.html'],
//      dest:'{{ROOT}}/www'
//  }
};