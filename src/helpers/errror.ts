export const formatErrorMessage = (error: any): string => {
  if (!error.response) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }

  const {status, data} = error.response;

  // Handle validation error (422)
  if (status === 422 && data.errors) {
    const validationErrors = Object.values(data.errors).flat();
    return validationErrors.join('\n');
  }

  // Handle other API errors
  if (data.message) {
    return data.message;
  }

  // Handle specific HTTP status codes
  switch (status) {
    case 500:
      return 'Terjadi kesalahan pada server.';
    case 401:
      return 'Sesi Anda telah berakhir. Silakan login kembali.';
    case 403:
      return 'Anda tidak memiliki akses untuk melakukan aksi ini.';
    case 404:
      return 'Data yang dicari tidak ditemukan.';
    default:
      return 'Terjadi kesalahan yang tidak diketahui.';
  }
};
