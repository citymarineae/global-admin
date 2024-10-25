interface MongoDocument {
  _id: string; // Assuming _id is a string; adjust according to your schema
  __v?: number; // Optional version field
  [key: string]: unknown; // Allow other fields
}

export function formatDbResponse(documents: MongoDocument | MongoDocument[]): object | object[] {
  const cleanDocument = (doc: MongoDocument): object => {
    // Convert the document to a plain object
    const plainDoc = JSON.parse(JSON.stringify(doc));

    // Remove MongoDB-specific fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...cleanedDoc } = plainDoc;

    // Convert any remaining Date objects to ISO strings
    Object.keys(cleanedDoc).forEach((key) => {
      if (cleanedDoc[key] instanceof Date) {
        cleanedDoc[key] = (cleanedDoc[key] as Date).toISOString();
      }
    });

    return {
      id: _id.toString(),
      ...cleanedDoc,
    };
  };

  if (Array.isArray(documents)) {
    return documents.map(cleanDocument);
  } else {
    return cleanDocument(documents);
  }
}
