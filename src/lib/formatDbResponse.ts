type DbDocument = {
  _id: string;
  __v: string;
  [key: string]: unknown;
};

export function formatDbResponse(data: DbDocument | DbDocument[]): unknown {
  const formatSingle = (item: DbDocument) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = item;
    return {
      id: _id.toString(),
      ...rest,
    };
  };

  if (Array.isArray(data)) {
    return data.map(formatSingle);
  } else {
    return formatSingle(data);
  }
}
