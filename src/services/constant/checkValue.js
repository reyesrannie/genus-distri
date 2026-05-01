export const filterNavigationByAccess = (navItems, accessPermission) => {
  const cleanedItems = accessPermission?.map((item) => item?.trim());

  const parentCheck = navItems?.filter((items) =>
    items?.permission?.some((p) => cleanedItems?.includes(p))
  );

  const filterChild = parentCheck?.map((item) => {
    if (item?.children) {
      const filteredChildren = item?.children?.filter((child) =>
        child?.permission?.some((p) => cleanedItems?.includes(p))
      );
      return { ...item, children: filteredChildren };
    }
    return item;
  });

  return filterChild || [];
};
