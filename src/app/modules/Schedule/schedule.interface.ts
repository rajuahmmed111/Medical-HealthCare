export interface ISchedulePayload {
  startDate: string; // Format: "yyyy-MM-dd"
  endDate: string;
  startTime: string;
  endTime: string; // Format: "HH:mm" (24-hour format)
}

export interface IScheduleFilterRequest {
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export type PaginatedResponse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T[];
};
