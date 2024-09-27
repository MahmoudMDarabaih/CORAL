const notAllowedCharacters = /[/\\?%*:|"<>]/;

const isValidFileName = (name: string): boolean => {
  if (name.length === 0) {
    return false;
  }
  if (notAllowedCharacters.test(name)) {
    return false;
  }
  return true;
};

export default isValidFileName;
