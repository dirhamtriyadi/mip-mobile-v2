export type DetailPenagihanData = {
  id: number;
  bill_number: string;
  date_exec: any;
  customer_id: number;
  customer: {
    name_customer: string;
    name_mother: string;
    installments: string;
    month_arrears: string;
    due_date: any | null;
    customer_address: {
      address: string;
      village: string;
      subdistrict: string;
    };
  };
  user_id: number;
  status: string;
  description: string;
  proof: string | null;
  promise_date: any | null;
  payment_amount: number | null;
  signature_officer: string | null;
  signature_customer: string | null;
};
