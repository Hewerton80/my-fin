export const capitalizeFisrtLetter = (str: string) => {
  // remove all underscores and replace with space
  return (
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, " ")
  );
};
