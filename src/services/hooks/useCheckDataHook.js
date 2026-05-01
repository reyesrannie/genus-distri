import { useSelector } from "react-redux";

const useCheckCharging = () => {
  const userData = useSelector((state) => state?.modal?.user || null);
  const chargingData = useSelector(
    (state) => state?.values?.chargingData || [],
  );

  if (!userData) {
    return false;
  }

  const items = [
    ...(userData?.customer || []),
    {
      charging_code: userData?.charging_code,
      charging_name: userData?.charging_name,
    },
  ];

  const matched = items?.every((charge) =>
    chargingData?.some((charging) => charging?.code === charge?.charging_code),
  );

  return matched;
};

const useGetDataQueryHook = async () => {};

export { useCheckCharging };
