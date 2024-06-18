export const AUTHORITIES = {
  TRADE: 'act:trade', // giao dịch hàng ngày
  SUPERVISE: 'act:supervise', // danh mục quản lý
  ADMIN: 'act:admin',
};

export const ACTION = {
  ADD: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DETAIL: 'DETAIL',
  GET: 'GET',
  ALL: 'ALL',
};

export const MESSAGE_WARNING_CHANGE_DATA = 'Các thay đổi bạn đã thực hiện có thể không được lưu.';

export const messages = {
  DATA_ERROR_ALERT: 'Internal Error',
};
export const passwordRegex = /^(?=.*[!@#$%^&*()_+{}|:<>?~[\]^-])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_FORMAT_PAYLOAD = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT_PAYLOAD = 'YYYY-MM-DD HH:mm';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
