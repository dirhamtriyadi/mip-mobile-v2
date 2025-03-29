export type CutiData = {
  start_date: any;
  end_date: any;
  status: string;
  response: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    detail_users: {
      id: string;
      nik: string;
    };
    created_at: string;
    updated_at: string;
  };
};
