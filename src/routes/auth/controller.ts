import { FieldSet, Record as AirtableRecord, Records } from '@airtable/blocks/models';

// Update type definitions
type AirtableRecord = Records<FieldSet>[number];

// Fix the records type
const records: readonly Record<FieldSet>[] = await usersTable
    .select({
        filterByFormula: `{Email} = '${email}'`
    })
    .firstPage();

// Fix create record
const createdRecord = await usersTable.create({
    fields: {
        email: email,  // Use lowercase field names as per Airtable API
        // other fields...
    }
});

// Access id properly
userId = createdRecord.id; 