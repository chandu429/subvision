import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import strip from '@rollup/plugin-strip';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      emitCss: true,
      // add postcss config with tailwind
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [require('tailwindcss'), require('autoprefixer')]
        },
        scss: { includePaths: ['src', 'node_modules', 'public'] }
      }),
      compilerOptions: {
        dev: !production
      }
    }),
    css({ output: 'bundle.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    injectProcessEnv({
      STAGE: process.env.STAGE,
      NODE_ENV: process.env.NODE_ENV,
      EMAIL_GATEWAY: process.env.EMAIL_GATEWAY
    }),
    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),
    !production && serve(),
    !production && livereload('public'),
    production && terser(),
    strip({
      include: '**/*.(mjs|js|ts|svelte)'
    })
  ],
  watch: {
    clearScreen: false
  }
};
