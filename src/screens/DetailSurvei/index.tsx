import InputField from '@src/components/InputField';
import InputFieldNumber from '@src/components/InputFieldNumber';
import InputFieldTextArea from '@src/components/InputFieldTextArea';
import LocationPicker from '@src/components/LocationPicker';
import {useLocation} from '@src/hooks/useLocation';
import globalStyles from '@src/styles/styles';
import {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import InputCurrency from '@src/components/InputCurrency';
import dayjs from 'dayjs';
import useDatePicker from '@src/hooks/useDatePicker';
import DatePicker from 'react-native-date-picker';
import InputStatusPicker from '@src/components/InputStatusPicker';
import InputSignature from '@src/components/InputSignature';
import AccordionSection from '@src/components/AccordionSection';
import ImagePicker from '@src/components/ImagePicker';
import useImagePicker from '@src/hooks/useImagePicker';
import {SurveiFormData} from '@src/types/survei';
import instance from '@src/configs/axios';
import Button from '@src/components/Button';
import {useNotification} from '@src/hooks/useNotification';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from 'App';
import RNFetchBlob from 'react-native-blob-util';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DetailSurveiScreenProps {
  route: any;
}

function DetailSurveiScreen({route}: DetailSurveiScreenProps) {
  const {id} = route.params;
  const [formDataSurvei, setFormDataSurvei] = useState<SurveiFormData>({
    id: '',
    name: '',
    address: '',
    number_ktp: '',
    address_status: '',
    phone_number: '',
    npwp: '',
    company_name: '',
    employee_tenure: '',
    job_level: '',
    employee_status: '',
    job_type: '',
    salary: 0,
    other_business: 0,
    monthly_living_expenses: 0,
    children: '',
    wife: '',
    couple_jobs: '',
    couple_business: '',
    couple_income: 0,
    bank_debt: 0,
    cooperative_debt: 0,
    personal_debt: 0,
    online_debt: 0,
    customer_character_analysis: '',
    financial_report_analysis: '',
    slik_result: '',
    info_provider_name: '',
    info_provider_position: '',
    workplace_condition: '',
    employee_count: '',
    business_duration: '',
    office_address: '',
    office_phone: '',
    loan_application: 0,
    recommendation_from_vendors: '',
    recommendation_from_treasurer: '',
    recommendation_from_other: '',
    source_1_full_name: '',
    source_1_gender: '',
    source_1_source_relationship: '',
    source_1_source_character: '',
    source_1_knows_prospect_customer: '',
    source_1_prospect_lives_at_address: '',
    source_1_length_of_residence: '',
    source_1_house_ownership_status: '',
    source_1_prospect_status: '',
    source_1_number_of_dependents: '',
    source_1_prospect_character: '',
    source_2_full_name: '',
    source_2_gender: '',
    source_2_source_relationship: '',
    source_2_source_character: '',
    source_2_knows_prospect_customer: '',
    source_2_prospect_lives_at_address: '',
    source_2_length_of_residence: '',
    source_2_house_ownership_status: '',
    source_2_prospect_status: '',
    source_2_number_of_dependents: '',
    source_2_prospect_character: '',
    recommendation_pt: '',
    descriptionSurvey: '',
    locationSurvey: '',
    dateSurvey: dayjs(),
    latitude: 0,
    longitude: 0,
    locationString: '',
    signature_officer: null,
    signature_customer: null,
    signature_couple: null,
    workplace_image1: null,
    workplace_image2: null,
    customer_image: null,
    ktp_image: null,
    loan_guarantee_image1: null,
    loan_guarantee_image2: null,
    kk_image: null,
    id_card_image: null,
    salary_slip_image1: null,
    salary_slip_image2: null,
  });
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const {showNotification} = useNotification();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {location, getCurrentLocation, changeLocationMarker} = useLocation();
  const {date, openDatePicker, setOpenDatePicker, handleDateChange} =
    useDatePicker(formDataSurvei.dateSurvey);
  const {
    image: imageWorkplace1,
    handleClickOpenCamera: handleClickOpenCameraWorkplaceImage1,
    handleImageSelect: handleImageSelectWorkplaceImage1,
    handleClickReset: handleClickResetWorkplaceImage1,
  } = useImagePicker();
  const {
    image: imageWorkplace2,
    handleClickOpenCamera: handleClickOpenCameraWorkplaceImage2,
    handleImageSelect: handleImageSelectWorkplaceImage2,
    handleClickReset: handleClickResetWorkplaceImage2,
  } = useImagePicker();
  const {
    image: imageCustomer,
    handleClickOpenCamera: handleClickOpenCameraCustomerImage,
    handleImageSelect: handleImageSelectCustomerImage,
    handleClickReset: handleClickResetCustomerImage,
  } = useImagePicker();
  const {
    image: imageKtp,
    handleClickOpenCamera: handleClickOpenCameraKtpImage,
    handleImageSelect: handleImageSelectKtpImage,
    handleClickReset: handleClickResetKtpImage,
  } = useImagePicker();
  const {
    image: imageLoanGuarantee1,
    handleClickOpenCamera: handleClickOpenCameraLoanGuarantee1,
    handleImageSelect: handleImageSelectLoanGuarantee1,
    handleClickReset: handleClickResetLoanGuarantee1,
  } = useImagePicker();
  const {
    image: imageLoanGuarantee2,
    handleClickOpenCamera: handleClickOpenCameraLoanGuarantee2,
    handleImageSelect: handleImageSelectLoanGuarantee2,
    handleClickReset: handleClickResetLoanGuarantee2,
  } = useImagePicker();
  const {
    image: imageKk,
    handleClickOpenCamera: handleClickOpenCameraKkImage,
    handleImageSelect: handleImageSelectKkImage,
    handleClickReset: handleClickResetKkImage,
  } = useImagePicker();
  const {
    image: imageIdCard,
    handleClickOpenCamera: handleClickOpenCameraIdCardImage,
    handleImageSelect: handleImageSelectIdCardImage,
    handleClickReset: handleClickResetIdCardImage,
  } = useImagePicker();
  const {
    image: imageSlipSalary1,
    handleClickOpenCamera: handleClickOpenCameraSlipSalaryImage1,
    handleImageSelect: handleImageSelectSlipSalaryImage1,
    handleClickReset: handleClickResetSlipSalaryImage1,
  } = useImagePicker();
  const {
    image: imageSlipSalary2,
    handleClickOpenCamera: handleClickOpenCameraSlipSalaryImage2,
    handleImageSelect:
      handleImageSelectSliphandleClickOpenCameraSlipSalaryImage2,
    handleClickReset: handleClickResetSliphandleClickOpenCameraSlipSalaryImage2,
  } = useImagePicker();

  useEffect(() => {
    setFormDataSurvei(prevData => ({
      ...prevData,
      dateSurvey: date,
      latitude: location.latitude,
      longitude: location.longitude,
      locationString: location.locationString,
    }));
  }, [location, date]);

  const fetchSurveyDetails = async () => {
    try {
      const response = await instance.get(
        `v1/prospective-customer-surveys/${id}`,
      );
      setFormDataSurvei(prevData => ({...prevData, ...response.data.data}));
    } catch (error: any) {
      console.log(error.response);

      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchSurveyDetails();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const formData = new FormData();
      const surveyData = {
        _method: 'PUT',
        name: formDataSurvei.name,
        address: formDataSurvei.address,
        number_ktp: formDataSurvei.number_ktp,
        address_status: formDataSurvei.address_status,
        phone_number: formDataSurvei.phone_number,
        npwp: formDataSurvei.npwp,
        company_name: formDataSurvei.company_name,
        employee_tenure: formDataSurvei.employee_tenure,
        job_level: formDataSurvei.job_level,
        employee_status: formDataSurvei.employee_status,
        salary: formDataSurvei.salary,
        other_business: formDataSurvei.other_business,
        monthly_living_expenses: formDataSurvei.monthly_living_expenses,
        children: formDataSurvei.children,
        wife: formDataSurvei.wife,
        couple_jobs: formDataSurvei.couple_jobs,
        couple_business: formDataSurvei.couple_business,
        couple_income: formDataSurvei.couple_income,
        bank_debt: formDataSurvei.bank_debt,
        cooperative_debt: formDataSurvei.cooperative_debt,
        personal_debt: formDataSurvei.personal_debt,
        online_debt: formDataSurvei.online_debt,
        customer_character_analysis: formDataSurvei.customer_character_analysis,
        financial_report_analysis: formDataSurvei.financial_report_analysis,
        slik_result: formDataSurvei.slik_result,
        info_provider_name: formDataSurvei.info_provider_name,
        info_provider_position: formDataSurvei.info_provider_position,
        workplace_condition: formDataSurvei.workplace_condition,
        employee_count: formDataSurvei.employee_count,
        business_duration: formDataSurvei.business_duration,
        office_address: formDataSurvei.office_address,
        office_phone: formDataSurvei.office_phone,
        loan_application: formDataSurvei.loan_application,
        recommendation_from_vendors: formDataSurvei.recommendation_from_vendors,
        recommendation_from_treasurer:
          formDataSurvei.recommendation_from_treasurer,
        recommendation_from_other: formDataSurvei.recommendation_from_other,
        source_1_full_name: formDataSurvei.source_1_full_name,
        source_1_gender: formDataSurvei.source_1_gender,
        source_1_source_relationship:
          formDataSurvei.source_1_source_relationship,
        source_1_source_character: formDataSurvei.source_1_source_character,
        source_1_knows_prospect_customer:
          formDataSurvei.source_1_knows_prospect_customer,
        source_1_prospect_lives_at_address:
          formDataSurvei.source_1_prospect_lives_at_address,
        source_1_length_of_residence:
          formDataSurvei.source_1_length_of_residence,
        source_1_house_ownership_status:
          formDataSurvei.source_1_house_ownership_status,
        source_1_prospect_status: formDataSurvei.source_1_prospect_status,
        source_1_number_of_dependents:
          formDataSurvei.source_1_number_of_dependents,
        source_1_prospect_character: formDataSurvei.source_1_prospect_character,
        source_2_full_name: formDataSurvei.source_2_full_name,
        source_2_gender: formDataSurvei.source_2_gender,
        source_2_source_relationship:
          formDataSurvei.source_2_source_relationship,
        source_2_source_character: formDataSurvei.source_2_source_character,
        source_2_knows_prospect_customer:
          formDataSurvei.source_2_knows_prospect_customer,
        source_2_prospect_lives_at_address:
          formDataSurvei.source_2_prospect_lives_at_address,
        source_2_length_of_residence:
          formDataSurvei.source_2_length_of_residence,
        source_2_house_ownership_status:
          formDataSurvei.source_2_house_ownership_status,
        source_2_prospect_status: formDataSurvei.source_2_prospect_status,
        source_2_number_of_dependents:
          formDataSurvei.source_2_number_of_dependents,
        source_2_prospect_character: formDataSurvei.source_2_prospect_character,
        recommendation_pt: formDataSurvei.recommendation_pt,
        descriptionSurvey: formDataSurvei.descriptionSurvey,
        locationSurvey: formDataSurvei.locationSurvey,
        dateSurvey: dayjs(formDataSurvei.dateSurvey).format('YYYY-MM-DD'),
        latitude: formDataSurvei.latitude,
        longitude: formDataSurvei.longitude,
        locationString: formDataSurvei.locationString,
      };

      // Menambahkan semua field ke FormData
      Object.entries(surveyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Menambahkan gambar ke FormData
      const imageFields = {
        signature_officer: formDataSurvei.signature_officer,
        signature_customer: formDataSurvei.signature_customer,
        signature_couple: formDataSurvei.signature_couple,
        workplace_image1: imageWorkplace1,
        workplace_image2: imageWorkplace2,
        customer_image: imageCustomer,
        ktp_image: imageKtp,
        loan_guarantee_image1: imageLoanGuarantee1,
        loan_guarantee_image2: imageLoanGuarantee2,
        kk_image: imageKk,
        id_card_image: imageIdCard,
        salary_slip_image1: imageSlipSalary1,
        salary_slip_image2: imageSlipSalary2,
      };

      Object.entries(imageFields).forEach(([key, image]) => {
        if (image) {
          formData.append(key, {
            uri: image.uri,
            type: image.type || 'image/png',
            name: image.fileName || `${key}.png`,
          });
        }
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      };

      await instance.post(
        `v1/prospective-customer-surveys/${formDataSurvei.id}`,
        formData,
        config,
      );

      Alert.alert('Berhasil', 'Prospective customer survey berhasil disimpan', [
        {text: 'OK', onPress: () => navigation.navigate('Home')},
      ]);

      showNotification('Penagihan', 'Status penagihan berhasil ditambahkan');
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.status === 'error') {
        const errorMessages = Object.values(error.response?.data?.errors || {})
          .flat()
          .join(', ');
        return Alert.alert('Error', errorMessages || 'Terjadi kesalahan.');
      }

      return Alert.alert(
        'Error',
        'Terjadi kesalahan saat prospective customer survey!',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    }
  }, [
    formDataSurvei,
    imageCustomer,
    imageKtp,
    imageLoanGuarantee1,
    imageLoanGuarantee2,
    imageKk,
    imageIdCard,
    imageSlipSalary1,
    imageSlipSalary2,
    navigation,
    showNotification,
  ]);

  const downloadFile = useCallback(async (url: string, fileName: string) => {
    try {
      const token = await AsyncStorage.getItem('token');

      // **1️⃣ Cek dan minta izin penyimpanan (hanya Android < 30)**
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Error', 'Izin penyimpanan ditolak.');
          return;
        }
      }

      // **2️⃣ Pastikan path download benar**
      const {dirs} = RNFetchBlob.fs;
      const downloadDir = dirs.LegacyDownloadDir; // Folder Download yang benar
      const filePath = `${downloadDir}/MIP/${fileName}`;

      // **3️⃣ Gunakan Download Manager Android**
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'pdf', // Pastikan ekstensi benar
        addAndroidDownloads: {
          useDownloadManager: true, // Wajib untuk Android 10+
          notification: true,
          path: filePath, // Pastikan path ini benar
          title: fileName,
          description: 'Downloading file...',
          mime: 'application/pdf',
          mediaScannable: true,
        },
      })
        .fetch('GET', url, {
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf',
        })
        .then(res => {
          Alert.alert('Download Berhasil', `File disimpan di: ${filePath}`);
        })
        .catch(err => {
          console.error('Download Error:', err);
          Alert.alert(
            'Download Gagal',
            'Terjadi kesalahan saat mengunduh file.',
          );
        });
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  }, []);

  const handleDownloadPDF = useCallback(() => {
    const fileUrl = `${BASE_URL}v1/prospective-customer-surveys/${id}/export-pdf-by-customer`;
    const fileName = `customer_survey_${formDataSurvei.name}.pdf`;
    downloadFile(fileUrl, fileName);
  }, [id, formDataSurvei]);

  const requestManageStoragePermission = async () => {
    if (Number(Platform.Version) >= 30) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Izin penyimpanan penuh diberikan.');
      } else {
        console.log('Izin penyimpanan penuh ditolak.');
      }
    }
  };

  useEffect(() => {
    requestManageStoragePermission();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView scrollEnabled={scrollEnabled}>
        <View style={globalStyles.formContainer}>
          <Button
            label="Download pdf"
            style={{marginTop: 10}}
            onPress={handleDownloadPDF}
          />
          <AccordionSection title="1. CIF">
            <InputField
              label="Nama"
              placeholder="Masukan nama"
              value={formDataSurvei.name}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  name: text,
                }));
              }}
            />
            <InputFieldTextArea
              label="Alamat"
              placeholder="Masukan alamat"
              value={formDataSurvei.address}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  address: text,
                }));
              }}
            />
            <InputFieldNumber
              label="No KTP"
              placeholder="Masukan nomor KTP"
              value={formDataSurvei.number_ktp}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  number_ktp: numericValue,
                }));
              }}
            />
            <InputField
              label="Status Alamat"
              placeholder="Masukan status alamat"
              value={formDataSurvei.address_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  address_status: text,
                }));
              }}
            />
            <InputFieldNumber
              label="No Telepon"
              placeholder="Masukan nomor telepon"
              value={formDataSurvei.phone_number}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  phone_number: numericValue,
                }));
              }}
            />
            <InputField
              label="NPWP"
              placeholder="Masukan NPWP"
              value={formDataSurvei.npwp}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  npwp: text,
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="2. Pendapatan">
            <InputField
              label="Jenis Pekerjaan"
              placeholder="Masukan jenis pekerjaan"
              value={formDataSurvei.job_type}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  job_type: text,
                }));
              }}
            />
            <InputField
              label="Nama Perusahaan"
              placeholder="Masukan nama perusahaan"
              value={formDataSurvei.company_name}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  company_name: text,
                }));
              }}
            />
            <InputField
              label="Jabatan"
              placeholder="Masukan jabatan"
              value={formDataSurvei.job_level}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  job_level: text,
                }));
              }}
            />
            <InputField
              label="Lama Kerja"
              placeholder="Masukan lama kerja"
              value={formDataSurvei.employee_tenure}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  employee_tenure: text,
                }));
              }}
            />
            <InputField
              label="Status Karyawan"
              placeholder="Masukan status karyawan"
              value={formDataSurvei.employee_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  employee_status: text,
                }));
              }}
            />
            <InputCurrency
              label="Gaji*"
              placeholder="Masukan gaji"
              value={formDataSurvei.salary}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  salary: Number(text),
                }));
              }}
            />
            <InputCurrency
              label="Usaha Tambahan"
              placeholder="Masukan usaha tambahan"
              value={formDataSurvei.other_business}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  other_business: Number(text),
                }));
              }}
            />
            <InputCurrency
              label="Biaya hidup per bulan*"
              placeholder="Masukan biaya hidup per bulan"
              value={formDataSurvei.monthly_living_expenses}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  monthly_living_expenses: Number(text),
                }));
              }}
            />
            <Text>Tanggungan</Text>
            <InputField
              label="Anak"
              placeholder="Masukan anak"
              value={formDataSurvei.children}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  children: text,
                }));
              }}
            />
            <InputField
              label="Istri"
              placeholder="Masukan istri"
              value={formDataSurvei.wife}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  wife: text,
                }));
              }}
            />
            <Text>Kepemilikan Rumah</Text>
            <InputField
              label="Pekerjaan Pasangan"
              placeholder="Masukan pekerjaan pasangan"
              value={formDataSurvei.couple_jobs}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  couple_jobs: text,
                }));
              }}
            />
            <InputField
              label="Usaha Pasangan"
              placeholder="Masukan usaha pasangan"
              value={formDataSurvei.couple_business}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  couple_business: text,
                }));
              }}
            />
            <InputCurrency
              label="Pendapatan Pasangan"
              placeholder="Masukan pendapatan pasangan"
              value={formDataSurvei.couple_income}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  couple_income: Number(text),
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="3. Hutang">
            <InputCurrency
              label="Bank"
              placeholder="Masukan hutang bank"
              value={formDataSurvei.bank_debt}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  bank_debt: Number(text),
                }));
              }}
            />
            <InputCurrency
              label="Koperasi"
              placeholder="Masukan hutang koperasi"
              value={formDataSurvei.cooperative_debt}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  cooperative_debt: Number(text),
                }));
              }}
            />
            <InputCurrency
              label="Perorangan"
              placeholder="Masukan hutang perorangan"
              value={formDataSurvei.personal_debt}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  personal_debt: Number(text),
                }));
              }}
            />
            <InputCurrency
              label="Online"
              placeholder="Masukan hutang online"
              value={formDataSurvei.online_debt}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  online_debt: Number(text),
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="4. Scorring">
            <InputField
              label="A. Analisa Karakter Nasabah"
              placeholder="Masukan analisa karakter nasabah"
              value={formDataSurvei.customer_character_analysis}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  customer_character_analysis: text,
                }));
              }}
            />
            <InputField
              label="B. Analisa Laporan Keuangan"
              placeholder="Masukan analisa laporan keuangan"
              value={formDataSurvei.financial_report_analysis}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  financial_report_analysis: text,
                }));
              }}
            />
            <InputField
              label="C. Hasil Slik"
              placeholder="Masukan hasil slik"
              value={formDataSurvei.slik_result}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  slik_result: text,
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="5. Informasi Tambahan dan Pengajuan">
            <InputField
              label="Nama Pemberi Informasi"
              placeholder="Masukan nama pemeberi informasi"
              value={formDataSurvei.info_provider_name}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  info_provider_name: text,
                }));
              }}
            />
            <InputField
              label="Jabatan Pemberi Informasi"
              placeholder="Masukan jabatan pemberi informasi"
              value={formDataSurvei.info_provider_position}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  info_provider_position: text,
                }));
              }}
            />
            <InputField
              label="Kondisi Tempat Kerja"
              placeholder="Masukan kondisi tempat kerja"
              value={formDataSurvei.workplace_condition}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  workplace_condition: text,
                }));
              }}
            />
            <InputField
              label="Banyak Karyawan"
              placeholder="Masukan banyak karyawan"
              value={formDataSurvei.employee_count}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  employee_count: text,
                }));
              }}
            />
            <InputField
              label="Lama Usaha Kantor"
              placeholder="Masukan lama usaha kantor"
              value={formDataSurvei.business_duration}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  business_duration: text,
                }));
              }}
            />
            <InputField
              label="Alamat Kantor"
              placeholder="Masukan alamat kantor"
              value={formDataSurvei.office_address}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  office_address: text,
                }));
              }}
            />
            <InputField
              label="Telepon Kantor"
              placeholder="Masukan telepon kantor"
              value={formDataSurvei.office_phone}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  office_phone: text,
                }));
              }}
            />
            <InputCurrency
              label="Pengajuan"
              placeholder="Masukan Pengajuan"
              value={formDataSurvei.loan_application}
              onChangeValue={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  loan_application: Number(text),
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="6. Rekomendasi dari">
            <InputField
              label="Vendor"
              placeholder="Masukan nama vendor"
              value={formDataSurvei.recommendation_from_vendors}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  recommendation_from_vendors: text,
                }));
              }}
            />
            <InputField
              label="Bendahara"
              placeholder="Masukan nama bendahara"
              value={formDataSurvei.recommendation_from_treasurer}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  recommendation_from_treasurer: text,
                }));
              }}
            />
            <InputFieldTextArea
              label="Lainnya"
              placeholder="Masukan lainnya"
              value={formDataSurvei.recommendation_from_other}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  recommendation_from_other: text,
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="7. Wawancara 1">
            <InputField
              label="Nama"
              placeholder="Masukan nama"
              value={formDataSurvei.source_1_full_name}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_full_name: text,
                }));
              }}
            />
            <InputField
              label="Jenis Kelamin"
              placeholder="Masukan jenis kelamin"
              value={formDataSurvei.source_1_gender}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_gender: text,
                }));
              }}
            />
            <InputField
              label="Hubungan Sumber Informasi"
              placeholder="Masukan hubungan sumber informasi"
              value={formDataSurvei.source_1_source_relationship}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_source_relationship: text,
                }));
              }}
            />
            <InputField
              label="Karakter Sumber Informasi"
              placeholder="Masukan karakter sumber informasi"
              value={formDataSurvei.source_1_source_character}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_source_character: text,
                }));
              }}
            />
            <InputField
              label="Kenal Dengan Calon Nasabah?"
              placeholder="Masukan keterangan"
              value={formDataSurvei.source_1_knows_prospect_customer}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_knows_prospect_customer: text,
                }));
              }}
            />
            <InputField
              label="Calon Nasabah Tinggal di Alamat tersebut?"
              placeholder="Masukan keterangan"
              value={formDataSurvei.source_1_prospect_lives_at_address}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_prospect_lives_at_address: text,
                }));
              }}
            />
            <InputField
              label="Lama Tinggal"
              placeholder="Masukan lama tinggal"
              value={formDataSurvei.source_1_length_of_residence}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_length_of_residence: text,
                }));
              }}
            />
            <InputField
              label="Status Kepemilikan Rumah"
              placeholder="Masukan status kepemilikan rumah"
              value={formDataSurvei.source_1_house_ownership_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_house_ownership_status: text,
                }));
              }}
            />
            <InputField
              label="Status Calon Nasabah"
              placeholder="Masukan status calon nasabah"
              value={formDataSurvei.source_1_prospect_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_prospect_status: text,
                }));
              }}
            />
            <InputField
              label="Jumlah Tanggungan"
              placeholder="Masukkan jumlah tanggungan"
              value={formDataSurvei.source_1_number_of_dependents}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_number_of_dependents: text,
                }));
              }}
            />
            <InputField
              label="Karakter Calon Nasabah"
              placeholder="Masukkan karakter calon nasabah"
              value={formDataSurvei.source_1_prospect_character}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_1_prospect_character: text,
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="8. Wawancara 2 (Opsional)">
            <InputField
              label="Nama"
              placeholder="Masukan nama"
              value={formDataSurvei.source_2_full_name}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_full_name: text,
                }));
              }}
            />
            <InputField
              label="Jenis Kelamin"
              placeholder="Masukan jenis kelamin"
              value={formDataSurvei.source_2_gender}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_gender: text,
                }));
              }}
            />
            <InputField
              label="Hubungan Sumber Informasi"
              placeholder="Masukan hubungan sumber informasi"
              value={formDataSurvei.source_2_source_relationship}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_source_relationship: text,
                }));
              }}
            />
            <InputField
              label="Karakter Sumber Informasi"
              placeholder="Masukan karakter sumber informasi"
              value={formDataSurvei.source_2_source_character}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_source_character: text,
                }));
              }}
            />
            <InputField
              label="Kenal Dengan Calon Nasabah?"
              placeholder="Masukan keterangan"
              value={formDataSurvei.source_2_knows_prospect_customer}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_knows_prospect_customer: text,
                }));
              }}
            />
            <InputField
              label="Calon Nasabah Tinggal di Alamat tersebut?"
              placeholder="Masukan keterangan"
              value={formDataSurvei.source_2_prospect_lives_at_address}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_prospect_lives_at_address: text,
                }));
              }}
            />
            <InputField
              label="Lama Tinggal"
              placeholder="Masukan lama tinggal"
              value={formDataSurvei.source_2_length_of_residence}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_length_of_residence: text,
                }));
              }}
            />
            <InputField
              label="Status Kepemilikan Rumah"
              placeholder="Masukan status kepemilikan rumah"
              value={formDataSurvei.source_2_house_ownership_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_house_ownership_status: text,
                }));
              }}
            />
            <InputField
              label="Status Calon Nasabah"
              placeholder="Masukan status calon nasabah"
              value={formDataSurvei.source_2_prospect_status}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_prospect_status: text,
                }));
              }}
            />
            <InputField
              label="Jumlah Tanggungan"
              placeholder="Masukkan jumlah tanggungan"
              value={formDataSurvei.source_2_number_of_dependents}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_number_of_dependents: text,
                }));
              }}
            />
            <InputField
              label="Karakter Calon Nasabah"
              placeholder="Masukkan karakter calon nasabah"
              value={formDataSurvei.source_2_prospect_character}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  source_2_prospect_character: text,
                }));
              }}
            />
          </AccordionSection>
          <AccordionSection title="9. Catatan Rekomendasi PT">
            <InputStatusPicker
              label="Direkomendasikan"
              value={formDataSurvei.recommendation_pt}
              onChange={value =>
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  recommendation_pt: value,
                }))
              }
              options={[
                {label: 'Ya', value: 'yes'},
                {label: 'Tidak', value: 'no'},
              ]}
            />
            <InputFieldTextArea
              label="Keterangan"
              placeholder="Masukan keterangan"
              value={formDataSurvei.descriptionSurvey}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  descriptionSurvey: text,
                }));
              }}
            />
            <InputField
              label="Tempat"
              placeholder="Masukan tempat"
              value={formDataSurvei.locationSurvey}
              onChangeText={text => {
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  locationSurvey: text,
                }));
              }}
            />
            <InputField
              label="Tanggal"
              placeholder="Tanggal"
              value={
                formDataSurvei.dateSurvey
                  ? dayjs(formDataSurvei.dateSurvey).format('dddd, DD-MM-YYYY')
                  : dayjs().format('dddd, DD-MM-YYYY')
              }
              onChangeText={() => {}}
              editable={false}
              onIconPress={() => setOpenDatePicker(true)}
              iconName="calendar"
            />
            <LocationPicker
              label="Lokasi"
              placeholder="Lokasi"
              location={location}
              getCurrentLocation={getCurrentLocation}
              onDragMarker={changeLocationMarker}
            />
            <InputSignature
              label="TTD Petugas"
              signature={formDataSurvei.signature_officer}
              onConfirm={result =>
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  signature_officer: result,
                }))
              }
              onScrollEnabledChange={setScrollEnabled}
            />
            <InputSignature
              label="TTD Nasabah"
              signature={formDataSurvei.signature_customer}
              onConfirm={result =>
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  signature_customer: result,
                }))
              }
              onScrollEnabledChange={setScrollEnabled}
            />
            <InputSignature
              label="TTD Pasangan/Penanggung Jawab"
              signature={formDataSurvei.signature_couple}
              onConfirm={result =>
                setFormDataSurvei(prevData => ({
                  ...prevData,
                  signature_couple: result,
                }))
              }
              onScrollEnabledChange={setScrollEnabled}
            />
          </AccordionSection>
          <AccordionSection title="10. Berkas">
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              1. Foto Gedung
            </Text>
            <View style={{padding: 10}}>
              <ImagePicker
                label="Foto Gedung 1"
                imageOld={formDataSurvei.workplace_image1}
                image={imageWorkplace1}
                onOpenCamera={handleClickOpenCameraWorkplaceImage1}
                onImageSelected={handleImageSelectWorkplaceImage1}
                onResetImage={handleClickResetWorkplaceImage1}
              />
              <ImagePicker
                label="Foto Gedung 2"
                imageOld={formDataSurvei.workplace_image2}
                image={imageWorkplace2}
                onOpenCamera={handleClickOpenCameraWorkplaceImage2}
                onImageSelected={handleImageSelectWorkplaceImage2}
                onResetImage={handleClickResetWorkplaceImage2}
              />
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              2. Foto Nasabah dan KTP
            </Text>
            <View style={{padding: 10}}>
              <ImagePicker
                label="Foto Nasabah"
                imageOld={formDataSurvei.customer_image}
                image={imageCustomer}
                onOpenCamera={handleClickOpenCameraCustomerImage}
                onImageSelected={handleImageSelectCustomerImage}
                onResetImage={handleClickResetCustomerImage}
              />
              <ImagePicker
                label="Foto KTP"
                imageOld={formDataSurvei.ktp_image}
                image={imageKtp}
                onOpenCamera={handleClickOpenCameraKtpImage}
                onImageSelected={handleImageSelectKtpImage}
                onResetImage={handleClickResetKtpImage}
              />
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              3. Foto Jaminan
            </Text>
            <View style={{padding: 10}}>
              <ImagePicker
                label="Foto Jaminan 1"
                imageOld={formDataSurvei.loan_guarantee_image1}
                image={imageLoanGuarantee1}
                onOpenCamera={handleClickOpenCameraLoanGuarantee1}
                onImageSelected={handleImageSelectLoanGuarantee1}
                onResetImage={handleClickResetLoanGuarantee1}
              />
              <ImagePicker
                label="Foto Jaminan 2"
                imageOld={formDataSurvei.loan_guarantee_image2}
                image={imageLoanGuarantee2}
                onOpenCamera={handleClickOpenCameraLoanGuarantee2}
                onImageSelected={handleImageSelectLoanGuarantee2}
                onResetImage={handleClickResetLoanGuarantee2}
              />
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              4. Foto KK dan ID Card
            </Text>
            <View style={{padding: 10}}>
              <ImagePicker
                label="Foto KK"
                imageOld={formDataSurvei.kk_image}
                image={imageKk}
                onOpenCamera={handleClickOpenCameraKkImage}
                onImageSelected={handleImageSelectKkImage}
                onResetImage={handleClickResetKkImage}
              />
              <ImagePicker
                label="Foto ID Card"
                imageOld={formDataSurvei.id_card_image}
                image={imageIdCard}
                onOpenCamera={handleClickOpenCameraIdCardImage}
                onImageSelected={handleImageSelectIdCardImage}
                onResetImage={handleClickResetIdCardImage}
              />
            </View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>5. Slip Gaji</Text>
            <View style={{padding: 10}}>
              <ImagePicker
                label="Slip Gaji 1"
                imageOld={formDataSurvei.salary_slip_image1}
                image={imageSlipSalary1}
                onOpenCamera={handleClickOpenCameraSlipSalaryImage1}
                onImageSelected={handleImageSelectSlipSalaryImage1}
                onResetImage={handleClickResetSlipSalaryImage1}
              />
              <ImagePicker
                label="Slip Gaji 2"
                imageOld={formDataSurvei.salary_slip_image2}
                image={imageSlipSalary2}
                onOpenCamera={handleClickOpenCameraSlipSalaryImage2}
                onImageSelected={
                  handleImageSelectSliphandleClickOpenCameraSlipSalaryImage2
                }
                onResetImage={
                  handleClickResetSliphandleClickOpenCameraSlipSalaryImage2
                }
              />
            </View>
          </AccordionSection>
          <Button
            label="Kirim"
            style={{marginBottom: 10}}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
      <DatePicker
        modal
        mode="date"
        minimumDate={dayjs().hour(0).minute(0).second(0).toDate()}
        open={openDatePicker}
        date={
          formDataSurvei.dateSurvey
            ? dayjs(formDataSurvei.dateSurvey).toDate()
            : dayjs().toDate()
        }
        onConfirm={handleDateChange}
        onCancel={() => setOpenDatePicker(false)}
      />
    </SafeAreaView>
  );
}

export default DetailSurveiScreen;
