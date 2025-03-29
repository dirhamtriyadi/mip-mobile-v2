import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import InputField from '@components/InputField';
import InputCurrency from '@components/InputCurrency';
import ImagePicker from '@components/ImagePicker';
import InputSignature from '@components/InputSignature';
import InputDatePicker from '@components/InputDatePicker';
import InputStatusPicker from '@components/InputStatusPicker';
import globalStyles from '@src/styles/styles';
import InputFieldTextArea from '@components/InputFieldTextArea';
import dayjs from 'dayjs';

interface FormPenagihanProps {
  data: any;
  onDataChange: (data: any) => void;
  onOpenCamera: () => void;
  onImageSelect: () => void;
  onImageReset: () => void;
  onScrollEnabledChange?: (scrollEnabled: boolean) => void;
}

function FormPenagihan({
  data,
  onDataChange,
  onOpenCamera,
  onImageSelect,
  onImageReset,
  onScrollEnabledChange,
}: FormPenagihanProps) {
  dayjs.locale('id');
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    if (onScrollEnabledChange) {
      onScrollEnabledChange(scrollEnabled);
    }
  }, [scrollEnabled]);

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
        value={data.customer.due_date ? dayjs(data.customer.due_date).format('DD MMMM YYYY') : ''}
        editable={false}
        iconName='calendar'
        onChangeText={() => {}}
      />
      <InputStatusPicker
        value={data.status}
        onChange={value => onDataChange({...data, status: value})}
        options={[
          { label: 'Kunjungan', value: 'visit' },
          { label: 'Janji Bayar', value: 'promise_to_pay' },
          { label: 'Bayar', value: 'pay' },
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
      <InputSignature
        label="TTD Petugas"
        signature={data.signature_officer}
        onConfirm={result => onDataChange({...data, signature_officer: result})}
        onScrollEnabledChange={scrollEnabled => setScrollEnabled(scrollEnabled)}
      />
      <InputSignature
        label="TTD Customer"
        signature={data.signature_customer}
        onConfirm={result =>
          onDataChange({...data, signature_customer: result})
        }
        onScrollEnabledChange={scrollEnabled => setScrollEnabled(scrollEnabled)}
      />
    </View>
  );
}

export default FormPenagihan;
