import UserRole from '../enums/userRoles';

const checkIfOwnerUserOrAdmin = async(
  ownerUserId?: string, authUserId?: string  , authUserRole?: UserRole,
): Promise<boolean> => {
  if (authUserRole !== 'admin'){
    if (authUserId !== ownerUserId){
      return false;
    }
    return true;
  }
  return true;
};

export { checkIfOwnerUserOrAdmin };
