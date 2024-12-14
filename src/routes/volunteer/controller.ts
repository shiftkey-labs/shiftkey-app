import { FieldSet, Record as AirtableRecord } from '@airtable/blocks/models';

// Fix the event IDs mapping
const eventIds = volunteerRecords.map((record) => {
    const eventField = record.fields.Event;
    if (Array.isArray(eventField) && eventField.length > 0) {
        return eventField[0];
    }
    return null;
}).filter((id): id is string => id !== null); 