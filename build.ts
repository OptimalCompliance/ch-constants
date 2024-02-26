import {parse} from 'yaml'
import {writeFile, mkdir, rm} from 'fs/promises'
import {pascalCase} from 'change-case'

// string transform to apply to the name of each constant mapping
const transform = pascalCase

const fileUrl = 'https://github.com/companieshouse/api-enumerations/raw/master/constants.yml'

const contents = await fetch(fileUrl).then(res=>res.text())

const constants: Record<string, Record<string,string>> = parse(contents)

await rm('build', {recursive: true}) // clear previous build
await mkdir('build', {recursive: true})

for(const [snake_name, mapping] of Object.entries(constants)){
    const name = transform(snake_name)
    const fileContent = `export const ${name} = ${JSON.stringify(mapping, null, 2)}`
    await writeFile(`build/${name}.mjs`, fileContent)

    const tsContent = Object.keys(mapping).length < 50 ? `export declare const ${name}: {
${Object.entries(mapping).map(([key, value])=>`\t"${key}": ${typeof value};`).join('\n')}
};` : `export declare const ${name}: Record<string, string>`
    await writeFile(`build/${name}.d.ts`, tsContent)
}

const indexContent = Object.keys(constants).map(name=>`export { ${transform(name)} } from './${transform(name)}.mjs';`).join('\n')
await writeFile(`build/index.mjs`, indexContent)

// const indexTsContent = Object.keys(constants).map(name=>`export { ${name} } from '${name}.mjs';`).join('\n')
await writeFile(`build/index.d.ts`, indexContent)