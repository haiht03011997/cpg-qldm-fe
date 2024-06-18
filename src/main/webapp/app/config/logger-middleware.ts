/* eslint no-console: off */
export default () => next => action => {
  if (DEVELOPMENT) {
    const { type, payload, meta, error } = action;

    if (error) {
      console.log('Error:', error);
    }
  }

  return next(action);
};
