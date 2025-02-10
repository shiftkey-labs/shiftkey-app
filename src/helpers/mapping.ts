interface FieldMapping {
    [key: string]: string;
}

export const mapToAirtableFields = (data: Record<string, unknown>, map: FieldMapping): Record<string, unknown> => {
    const airtableRecord: Record<string, unknown> = {};

    for (const [jsField, airtableField] of Object.entries(map)) {
        if (jsField in data) {
            airtableRecord[airtableField] = data[jsField as keyof typeof data];
        }
    }

    return airtableRecord;
};

export const mapFromAirtableFields = (record: { fields: Record<string, unknown> }, map: FieldMapping): Record<string, unknown> => {
    const mappedRecord: Record<string, unknown> = {};

    for (const [jsField, airtableField] of Object.entries(map)) {
        mappedRecord[jsField] = record.fields[airtableField] ?? null;
    }

    return mappedRecord;
}; 