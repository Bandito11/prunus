export interface ILog {
  date: string;
  time: string;
  description: string;
  dateObj: string;
}

export interface IResponse<T> {
  success: boolean;
  error: string;
  data: T;
  dateStamp?: string;
}
