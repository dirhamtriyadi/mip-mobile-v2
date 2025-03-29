export type LaporanPenagihanData = {
  id: string;
  bill_number: string | number;
  created_at: string;
  customer: {
    id: string;
    name_customer: string;
    name_mother: string;
    no_contract: string | number;
  };
  latestBillingFollowups?: {
    status?: {
      label: string;
      value: string;
    };
    promise_date?: string;
    date_exec?: string;
  };
};
