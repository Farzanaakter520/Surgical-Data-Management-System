exports.validateSignup = (data) => {
  const errors = [];

  if (!data.first_name) errors.push('First name is required');
  if (!data.last_name) errors.push('Last name is required');
  if (!data.email) errors.push('Email is required');
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.push('Email format is invalid');
  if (!data.password) errors.push('Password is required');
  else if (data.password.length < 6) errors.push('Password must be at least 6 characters');
  
  return errors.length > 0 ? errors : null;
};

exports.validateLogin = (data) => {
  const errors = [];
  if (!data.email) errors.push('Email is required');
  if (!data.password) errors.push('Password is required');
  return errors.length > 0 ? errors : null;
};