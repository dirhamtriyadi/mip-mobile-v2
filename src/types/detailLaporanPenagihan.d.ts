export type CustomerAddress = {
  id: number;
  customer_id: number;
  address: string;
  village: string;
  subdistrict: string;
  created_at: string;
  updated_at: string;
}

export type Customer = {
  id: number;
  no_contract: number;
  bank_account_number: number;
  name_customer: string;
  name_mother: string;
  phone_number: string;
  status: string | null;
  bank_id: number;
  margin_start: number;
  os_start: number;
  margin_remaining: number;
  installments: number;
  month_arrears: number;
  arrears: number;
  due_date: string;
  description: string;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  customer_address: CustomerAddress;
}

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  bank_id: number | null;
  created_at: string;
  updated_at: string;
}

export type Status = {
  label: string;
  value: string;
}

export type LatestBillingFollowups = {
  id: number;
  customer_billing_id: number;
  status: Status;
  date_exec: string;
  description: string;
  proof: string;
  promise_date: string | null;
  payment_amount: number | null;
  signature_officer: string;
  signature_customer: string | null;
}

export type BillingFollowups = {
  id: number;
  customer_billing_id: number;
  status: Status;
  date_exec: string;
  description: string;
  proof: string;
  promise_date: string | null;
  payment_amount: number | null;
  signature_officer: string;
  signature_customer: string | null;
}

export type DetailLaporanPenagihan = {
  id: number;
  bill_number: string;
  customer_id: number;
  customer: Customer;
  user_id: number;
  user: User;
  latestBillingFollowups: LatestBillingFollowups;
  billingFollowups: BillingFollowups[];
  created_at: string;
}
