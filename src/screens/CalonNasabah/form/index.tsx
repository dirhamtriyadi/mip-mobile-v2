import Button from '@src/components/Button';
import ImagePickerField from '@src/components/ImagePickerV1';
import InputField from '@src/components/InputField';
import InputFieldNumber from '@src/components/InputFieldNumber';
import InputSelectPicker from '@src/components/InputSelectPicker';
import {CalonNasabahCreateSchema} from '@src/schema';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';

interface FormCalonNasabahProps {
  control: Control<CalonNasabahCreateSchema>;
  errors: FieldErrors<CalonNasabahCreateSchema>;
  setValue: UseFormSetValue<CalonNasabahCreateSchema>;
  isValid: boolean;
  isSubmitting: boolean;
  watchedValues: CalonNasabahCreateSchema;
  banks: {label: string; value: string}[];
  loading: boolean;
  onSubmit: () => void;
}

function FormCalonNasabah({
  control,
  errors,
  setValue,
  isValid,
  isSubmitting,
  watchedValues,
  banks,
  loading,
  onSubmit: handleSubmit,
}: FormCalonNasabahProps) {
  console.log(errors);

  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({field: {onChange, onBlur, value}}) => (
          <InputField
            label="Nama Calon Nasabah"
            placeholder="Masukan Nama Calon Nasabah"
            value={value}
            onChangeText={(text: string) => {
              onChange(text);
            }}
            onBlur={onBlur}
            error={errors.name?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="no_ktp"
        render={({field: {onChange, onBlur, value}}) => (
          <InputFieldNumber
            label="Nomor KTP"
            placeholder="Masukan Nomor KTP"
            value={value?.toString() || ''}
            onChangeText={(text: string) => {
              onChange(text);
            }}
            onBlur={onBlur}
            error={errors.no_ktp?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="bank_id"
        render={({field: {onChange, onBlur, value}}) => (
          <InputSelectPicker
            label="Pilih Bank"
            value={value?.toString() || ''}
            onChange={(selectedValue: string) => {
              onChange(selectedValue);
            }}
            onBlur={onBlur}
            options={banks || []}
            error={errors.bank_id?.message}
            required
          />
        )}
      />
      <Controller
        control={control}
        name="ktp"
        render={({field: {onChange, onBlur, value}}) => (
          <ImagePickerField
            label="Foto KTP"
            value={value || null}
            onImageChange={onChange}
            onBlur={onBlur}
            placeholder="Ambil atau pilih foto KTP"
            required
            error={errors.ktp?.message}
            maxSizeInMB={2}
            allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          />
        )}
      />
      <Controller
        control={control}
        name="kk"
        render={({field: {onChange, onBlur, value}}) => (
          <ImagePickerField
            label="Foto Kartu Keluarga"
            value={value || null}
            onImageChange={onChange}
            onBlur={onBlur}
            placeholder="Ambil atau pilih foto KK"
            required
            error={errors.kk?.message}
            maxSizeInMB={2}
            allowedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          />
        )}
      />
      <Button disabled={loading} label="Simpan" onPress={handleSubmit} />
    </>
  );
}

export default FormCalonNasabah;
