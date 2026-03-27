import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://developers.muralpay.com/openapi/open-api-spec.json', 
  output: 'src/generated/heyapi',
});