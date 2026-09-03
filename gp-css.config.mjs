import { defineConfig } from './packages/gp-css/dist/index.js';

export default defineConfig({
  content: ['./apps/gp-ui-demo/src/**/*.{html,ts,scss}', './packages/gp-blocks/src/**/*.{html,ts,scss}'],
  inputCss: '@gp-css theme;\n@gp-css base;\n@gp-css components;\n@gp-css utilities;',
  output: './apps/gp-ui-demo/src/gp-css.generated.css',
  minify: true
});
