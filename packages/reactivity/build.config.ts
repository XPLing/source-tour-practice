import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
    entries: [
        'src/index',
        {
            builder: 'mkdist',
            input: 'src/components/',
            outDir: './dist/componets'
        }
    ],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true
    }
})
