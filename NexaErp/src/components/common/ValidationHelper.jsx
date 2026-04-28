export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Please fill this field'; 
  }
  return null;
};

export const validateEmail = (value) => {
  const error = validateRequired(value);
  if (error) return error;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) {
    return 'Invalid email format (e.g. user@gmail.com)';
  }
  return null;
};

export const validatePassword = (value) => {
  const error = validateRequired(value);
  if (error) return error;
  if (value.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

export const validateName = (value) => {
  const error = validateRequired(value);
  if (error) return error;
  if (value.length < 3) {
    return 'Name must be at least 3 characters';
  }
  return null;
};