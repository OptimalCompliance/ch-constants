import {parse} from 'yaml'
import {pascalCase} from 'change-case'
import {mkdir, rm, writeFile} from 'node:fs/promises'
import {basename} from 'node:path'
import {normalizeText} from "./normaliseText.ts";

// string transform to apply to the name of each constant mapping
const transform = pascalCase

const files = ['constants.yml', 'psc_descriptions.yml']

await rm('build', {recursive: true, force: true}) // clear previous build
await mkdir('build', {recursive: true})

const subdirs = []

for (const file of files) {
    const exportName = transform(basename(file, '.yml'))
    const fileUrl = `https://raw.githubusercontent.com/companieshouse/api-enumerations/refs/heads/master/${file}`

    const contents = await fetch(fileUrl).then(res => res.text())
    const constants: Record<string, Record<string, string>> = parse(contents)

    await mkdir(`build/${exportName}`, {recursive: true})

    for (const [snake_name, mapping] of Object.entries(constants)) {
        const name = transform(snake_name)
        const filePath = `build/${exportName}/${name}`
        const normalisedMapping = Object.fromEntries(Object.entries(mapping)
            .map(([key, value]) => [key, normalizeText(value)]))
        const fileContent = `export const ${name} = ${JSON.stringify(normalisedMapping, null, 2)}`
        await writeFile(filePath + '.js', fileContent)

        const tsContent = Object.keys(mapping).length < 50 ? `export declare const ${name}: {
${Object.entries(mapping).map(([key, value]) => `\t"${key}": ${typeof value};`).join('\n')}
};` : `export declare const ${name}: Record<string, string>`
        await writeFile(`${filePath}.d.ts`, tsContent)
    }

    const indexContent = Object.keys(constants).map(name => `export { ${transform(name)} } from './${transform(name)}.js';`).join('\n')
    await writeFile(`build/${exportName}/index.js`, indexContent)
    await writeFile(`build/${exportName}/index.d.ts`, indexContent)
    subdirs.push(exportName)
}

const indexContent = subdirs.map(name => `export * as ${name} from './${name}/index.js';`)
    .concat(`export * from './Constants/index.js';`).join('\n')

await writeFile(`build/index.js`, indexContent)
await writeFile(`build/index.d.ts`, indexContent)