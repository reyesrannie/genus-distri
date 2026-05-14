import { decodeUser } from "../functions/saveUser";

export const filterNavigationByAccess = (navItems, accessPermission) => {
  const cleanedItems = accessPermission?.map((item) => item?.trim());

  const parentCheck = navItems?.filter((items) =>
    items?.permission?.some((p) => cleanedItems?.includes(p)),
  );

  const filterChild = parentCheck?.map((item) => {
    if (item?.children) {
      const filteredChildren = item?.children?.filter((child) =>
        child?.permission?.some((p) => cleanedItems?.includes(p)),
      );
      return { ...item, children: filteredChildren };
    }
    return item;
  });

  return filterChild || [];
};

export const getMinDateOffset = (currentDate = new Date()) => {
  const userData = decodeUser();
  const cutoff = userData?.cut_off?.[0]?.time;

  let cutoffTimeInSeconds = 24 * 3600;

  if (cutoff) {
    const [cutoffHour, cutoffMinute, cutoffSecond = 0] = cutoff
      .split(":")
      .map(Number);

    cutoffTimeInSeconds = cutoffHour * 3600 + cutoffMinute * 60 + cutoffSecond;
  }

  const currentTimeInSeconds =
    currentDate.getHours() * 3600 +
    currentDate.getMinutes() * 60 +
    currentDate.getSeconds();

  const isPastCutoff = currentTimeInSeconds >= cutoffTimeInSeconds;

  return isPastCutoff ? 4 : 3;
};

export const canUpdateOrder = (dateNeeded, currentDate = new Date()) => {
  if (!dateNeeded) return false;

  const userData = decodeUser();
  const cutoffStr = userData?.cut_off?.[0]?.time;

  let cutoffHour = 24;
  let cutoffMinute = 0;
  let cutoffSecond = 0;

  if (cutoffStr) {
    [cutoffHour, cutoffMinute, cutoffSecond = 0] = cutoffStr
      .split(":")
      .map(Number);
  }

  const targetDate = new Date(dateNeeded);

  const updateDeadline = new Date(targetDate);
  updateDeadline.setDate(updateDeadline.getDate() - 3);
  updateDeadline.setHours(cutoffHour, cutoffMinute, cutoffSecond, 0);

  return currentDate < updateDeadline;
};
