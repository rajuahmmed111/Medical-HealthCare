export const searchFilter = (
  searchTerm: string,
  searchableFields: string[]
) => {
  if (!searchTerm) return undefined;

  return {
    OR: searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    })),
  };
};
