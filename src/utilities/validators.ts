function sizeValidator(param1: string, param2?: string): boolean {
  if (isNaN(parseInt(param1))) {
    return false;
  }
  if (param2) {
    if (isNaN(parseInt(param2))) {
      return false;
    }
  }
  return true;
}

function breedValidator(dog: string): boolean {
  switch (dog) {
    case 'corgi':
      return true;
    case 'maltese':
      return true;
    case 'lab':
      return true;
    default:
      return false;
  }
}

export { sizeValidator, breedValidator };
