import { FieldSet, Record as AirtableRecord } from '@airtable/blocks/models';

// Update the type definition
type AirtableRecord = Records<FieldSet>[number];

// Fix the registration record creation
const registrationRecord = await registrationTable.create({
    fields: mappedFields
}) as AirtableRecord;

// Fix the event check
return records.some((record) => {
    const eventField = record.get("Event");
    return Array.isArray(eventField) && eventField[0] === event.id;
}); 