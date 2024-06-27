# CH Constants

npm javascript publication of the constants found in this repo: https://github.com/companieshouse/api-enumerations

Install https://www.npmjs.com/package/@oc-digital/ch-constants
```
npm install @oc-digital/ch-constants
```

Example usage:
```js
import { OfficerRole, SicDescriptions } from '@oc-digital/ch-constants';

console.log(OfficerRole.director) // "Director"
console.log(SicDescriptions["1440"]) // "Production of salt"
```

Published as ES modules with Typescript definitions.

Built automatically by pulling the yaml file from the Companies House repository directly.