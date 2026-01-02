# CH Constants

npm javascript publication of the constants found in this repo: https://github.com/companieshouse/api-enumerations

Install https://www.npmjs.com/package/@oc-digital/ch-constants
```
npm install @oc-digital/ch-constants
```

Example usage of main constants:
```js
import { OfficerRole, SicDescriptions } from '@oc-digital/ch-constants';

console.log(OfficerRole.director) // "Director"
console.log(SicDescriptions["1440"]) // "Production of salt"
```
These "top level" constants are also available from the `Constants` namespace, but exported at the top level for convenience and backward compatibility.

## PSC descriptions (natures of control)
Person with significant control descriptions are published under the `PscDescriptions` namespace.
Example usage:
```ts
import { PscDescriptions } from '@oc-digital/ch-constants'

console.log(PscDescriptions.ShortDescription["voting-rights-75-to-100-percent"])
```

## Publishing a new version

1. Update the version in `package.json`
2. Create and push a git tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

The package will be automatically published to npm via GitHub Actions.

## Package info
Published as ES modules with Typescript definitions.

Built automatically by pulling the yaml files from the Companies House repository directly.
Code generation script is open source, see `./build.ts`.