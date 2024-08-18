import { defineConfig } from "rollup";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'
export default defineConfig({
    input: 'dist/main.js',
    output: {
        file: 'rollupdist/main.js',
        format: 'es'
    },
    plugins: [commonjs(),nodeResolve(),json()]
})