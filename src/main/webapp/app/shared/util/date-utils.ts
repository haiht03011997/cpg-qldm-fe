import dayjs from 'dayjs';

import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export const convertDateTimeFromServer = date => (date ? dayjs(date).format(APP_LOCAL_DATETIME_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? dayjs(date).toDate() : null);

export const convertDateTimeToDisplay = date => (date ? dayjs(date).format(APP_LOCAL_DATE_FORMAT) : null);

export const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);
