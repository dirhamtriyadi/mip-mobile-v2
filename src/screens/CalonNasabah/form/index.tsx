import Button from '@src/components/Button';
import ImagePicker from '@src/components/ImagePicker';
import InputField from '@src/components/InputField';
import InputFieldNumber from '@src/components/InputFieldNumber';
import InputSelectPicker from '@src/components/InputSelectPicker';

interface FormCalonNasabahProps {
  data: any;
  banks?: {label: string; value: string}[];
  onDataChange: (data: any) => void;
  imageKtp: any;
  imageKk: any;
  loading?: boolean;
  handleClickOpenCameraKtp: () => void;
  handleClickOpenCameraKk: () => void;
  handleImageSelectKtp: () => void;
  handleImageSelectKk: () => void;
  handleClickResetKtp: () => void;
  handleClickResetKk: () => void;
  handleSubmit: () => void;
}

function FormCalonNasabah({
  data,
  banks,
  onDataChange,
  imageKtp,
  imageKk,
  loading = false,
  handleClickOpenCameraKtp,
  handleClickOpenCameraKk,
  handleImageSelectKtp,
  handleImageSelectKk,
  handleClickResetKtp,
  handleClickResetKk,
  handleSubmit,
}: FormCalonNasabahProps) {
  return (
    <>
      <InputField
        label="Nama Calon Nasabah"
        placeholder="Masukan Nama Calon Nasabah"
        value={data.name}
        onChangeText={(value: string) => {
          onDataChange((prevData: any) => ({
            ...prevData,
            name: value,
          }));
        }}
      />
      <InputFieldNumber
        label="No KTP"
        placeholder="Masukan No KTP"
        value={data.no_ktp}
        onChangeText={(value: string) => {
          // only allow numbers
          value = value.replace(/[^0-9]/g, '');
          onDataChange((prevData: any) => ({
            ...prevData,
            no_ktp: value,
          }));
        }}
      />
      <InputSelectPicker
        label="Pilih Bank"
        value={data.bank}
        onChange={(value: string) => {
          onDataChange((prevData: any) => ({
            ...prevData,
            bank: value,
          }));
        }}
        options={banks || []}
      />
      <ImagePicker
        image={imageKtp}
        label="Ktp"
        onImageSelected={handleImageSelectKtp}
        onOpenCamera={handleClickOpenCameraKtp}
        onResetImage={handleClickResetKtp}
      />
      <ImagePicker
        image={imageKk}
        label="Kartu Keluarga"
        onImageSelected={handleImageSelectKk}
        onOpenCamera={handleClickOpenCameraKk}
        onResetImage={handleClickResetKk}
      />
      <Button disabled={loading} label="Simpan" onPress={handleSubmit} />
    </>
  );
}

export default FormCalonNasabah;
