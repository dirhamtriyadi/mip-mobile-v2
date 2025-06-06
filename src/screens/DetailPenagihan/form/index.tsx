import ImagePicker from '@components/ImagePicker';
import InputCurrency from '@components/InputCurrency';
import InputDatePicker from '@components/InputDatePicker';
import InputField from '@components/InputField';
import InputFieldTextArea from '@components/InputFieldTextArea';
import InputStatusPicker from '@components/InputStatusPicker';
import Button from '@src/components/Button';
import InputSignatureV1 from '@src/components/InputSignatureV1';
import globalStyles from '@src/styles/styles';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {View} from 'react-native';
import styles from '../styles';

interface FormPenagihanProps {
  data: any;
  isLoading?: boolean;
  onDataChange: (data: any) => void;
  onOpenCamera: () => void;
  onImageSelect: () => void;
  onImageReset: () => void;
  onScrollEnabledChange?: (scrollEnabled: boolean) => void;
  onHandleSubmit: () => void;
}

function FormPenagihan({
  data,
  isLoading = false,
  onDataChange,
  onOpenCamera,
  onImageSelect,
  onImageReset,
  onHandleSubmit,
}: FormPenagihanProps) {
  dayjs.locale('id');
  const [signatureModalConfig, setSignatureModalConfig] = useState({
    visible: false,
    type: '', // 'officer' or 'customer'
    label: '',
  });

  const handleSignatureConfirm = (result: string) => {
    const field =
      signatureModalConfig.type === 'officer'
        ? 'signature_officer'
        : 'signature_customer';
    onDataChange({...data, [field]: result});
    setSignatureModalConfig({visible: false, type: '', label: ''});
  };

  const handleOfficerSignatureChange = (value: string | null) => {
    onDataChange({...data, signature_officer: value});
  };

  const handleCustomerSignatureChange = (value: string | null) => {
    onDataChange({...data, signature_customer: value});
  };

  return (
    <View style={globalStyles.formContainer}>
      <InputField
        label="No Tagihan"
        placeholder="Masukan No Tagihan"
        value={data.bill_number}
        editable={false}
        onChangeText={() => {}}
      />
      <InputField
        label="Nama Nasabah"
        placeholder="Masukan Nama Nasabah"
        value={data.customer.name_customer}
        editable={false}
        onChangeText={() => {}}
      />
      <InputFieldTextArea
        label="Alamat"
        placeholder="Alamat Kosong"
        value={data.customer.customer_address.address}
        onChangeText={() => {}}
        editable={false}
      />
      <InputField
        label="Nama Ibu"
        placeholder="Nama Ibu Kosong"
        value={data.customer.name_mother}
        editable={false}
        onChangeText={() => {}}
      />
      <InputField
        label="Tunggak Bulan"
        placeholder="Tunggak Bulan Kosong"
        value={data.customer.month_arrears}
        editable={false}
        onChangeText={() => {}}
      />
      <InputCurrency
        label="Angsuran"
        placeholder="Angsuran Bulan Kosong"
        value={data.customer.installments || 0}
        onChangeValue={() => {}}
        editable={false}
      />
      <InputField
        label="Tanggal Jatuh Tempo"
        placeholder="Tanggal Jatuh Tempo Kosong"
        value={
          data.customer.due_date
            ? dayjs(data.customer.due_date).format('DD MMMM YYYY')
            : ''
        }
        editable={false}
        iconName="calendar"
        onChangeText={() => {}}
      />
      <InputStatusPicker
        value={data.status}
        onChange={value => onDataChange({...data, status: value})}
        options={[
          {label: 'Kunjungan', value: 'visit'},
          {label: 'Janji Bayar', value: 'promise_to_pay'},
          {label: 'Bayar', value: 'pay'},
        ]}
      />
      {data.status === 'promise_to_pay' && (
        <InputDatePicker
          label="Tanggal Janji Bayar"
          value={data.promise_date}
          iconName="calendar"
          onChange={value => onDataChange({...data, promise_date: value})}
        />
      )}
      {data.status === 'pay' && (
        <InputCurrency
          label="Nominal"
          placeholder="Masukan Nominal"
          value={data.payment_amount || 0}
          onChangeValue={value =>
            onDataChange({...data, payment_amount: value})
          }
        />
      )}
      <ImagePicker
        label="Bukti"
        image={data.proof}
        onOpenCamera={onOpenCamera}
        onImageSelected={onImageSelect}
        onResetImage={onImageReset}
      />
      <InputField
        label="Deskripsi"
        placeholder="Masukan Deskripsi"
        value={data.description || ''}
        onChangeText={value => onDataChange({...data, description: value})}
      />

      <InputSignatureV1
        label="Tanda Tangan Petugas"
        value={data.signature_officer}
        onSignatureChange={handleOfficerSignatureChange}
      />

      <InputSignatureV1
        label="Tanda Tangan Customer"
        value={data.signature_customer}
        onSignatureChange={handleCustomerSignatureChange}
      />

      <View style={[styles.formContainer, {marginBottom: 10}]}>
        <Button disabled={isLoading} label="Simpan" onPress={onHandleSubmit} />
      </View>
    </View>
  );
}

export default FormPenagihan;
