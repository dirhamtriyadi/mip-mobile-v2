import Button from '@src/components/Button';
import ImagePicker from '@src/components/ImagePicker';
import InputField from '@src/components/InputField';
import InputFieldNumber from '@src/components/InputFieldNumber';

interface FormCalonNasabahProps {
  data: any;
  onDataChange: (data: any) => void;
  imageKtp: any;
  imageKk: any;
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
  onDataChange,
  imageKtp,
  imageKk,
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
      <InputField
        label="Bank"
        placeholder="Masukan Bank"
        value={data.bank}
        onChangeText={(value: string) => {
          onDataChange((prevData: any) => ({
            ...prevData,
            bank: value,
          }));
        }}
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
      <Button label="Simpan" onPress={handleSubmit} />
    </>
  );
}

export default FormCalonNasabah;
