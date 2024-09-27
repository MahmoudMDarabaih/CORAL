import User from '../db-files/models/User';

const checkIfEmailExists = async(email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser !== null;
};

const checkIfUserExists = async(
  options: { email?: string, id?: string },
): Promise<User | null> => {
  const { email, id } = options;
  const query: { [key: string]: string } = {};

  if (email) {
    query.email = email;
  }

  if (id) {
    query.id = id;
  }

  const user = await User.findOne({ where: query });
  return user;
};

const userResponseFormatter = (user: User): object => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    mobileNumber: user.mobileNumber,
    role: user.role,
  };
};

export { checkIfEmailExists, checkIfUserExists , userResponseFormatter };
