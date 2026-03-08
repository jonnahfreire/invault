const fs = require('node:fs');
const path = require('node:path');
const converter = require('openapi-to-postmanv2');

const openapi = JSON.parse(fs.readFileSync(path.join(__dirname, './openapi.json'), 'utf8'));

converter.convert(
  { type: 'json', data: openapi },
  {
    folderStrategy: 'Tags',
    includeAuthInfoInExample: true,
    includeAuthInfoInCollection: true,
    requestNameSource: 'operationId',
    alwaysInheritAuthentication: true
  },
  (err, conversionResult) => {
    if (!conversionResult.result) {
      console.error('Erro:', conversionResult.reason);
      return;
    }

    fs.writeFileSync(
      path.join(__dirname, './Mira-Parceiros.postman_collection.json'),
      JSON.stringify(conversionResult.output[0].data, null, 2), 
    );

    console.log('Collection gerada com sucesso!');
  }
);