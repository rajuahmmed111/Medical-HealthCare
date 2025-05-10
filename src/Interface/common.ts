export const paginationField: string[] = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
];

export type IPaginationOptions = {
  page?: number | undefined;
  limit?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
};
