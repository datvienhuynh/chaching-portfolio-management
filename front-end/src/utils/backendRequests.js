/** handle generic errors with appropriate error messages */
export const handleError = (err) => {
  if (err.response) {
    // Request made and server responded
    console.error(err.response);
  } else if (err.request) {
    // The request was made but no response was received
    console.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(err.message);
  }
};
