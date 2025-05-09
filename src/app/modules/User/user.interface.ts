export type IUserFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    status?: string | undefined;
  };
  
  export type IPaginationOptions = {
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
  };
  