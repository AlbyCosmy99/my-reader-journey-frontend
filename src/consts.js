const isBrowser = typeof window !== 'undefined';
const isLocalHost =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const consts = {
  getFrontendUrl() {
    return (
      process.env.REACT_APP_FRONTEND_URL ||
      (isLocalHost
        ? 'http://localhost:3000'
        : 'https://my-reader-journey.onrender.com')
    );
  },
  getBackendUrl() {
    return (
      process.env.REACT_APP_BACKEND_URL ||
      (isLocalHost
        ? 'http://localhost:3030'
        : 'https://my-reader-journey-backend-1.onrender.com')
    );
  },
};

export default consts;
