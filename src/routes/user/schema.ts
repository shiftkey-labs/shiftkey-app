import { fieldMapping } from './constants';

const mappedFields = mapToAirtableFields(req.body.fields, fieldMapping); 