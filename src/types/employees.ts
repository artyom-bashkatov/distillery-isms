export type TEmployees = {
  data: Employ[];
};

export type ArrayEmployees = Employ[];

export type Employ = {
  id: string;
  comments: string;
  full_name_2: string;
  hire_date: string;
  termination_date?: string | null;
  location?: string;
  work_email: string;
  employment_history_status: string;
  [key: string]: any;
};