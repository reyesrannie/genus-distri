import dayjs from "dayjs";

export const mapOrderingPayload = (submitData) => {
  const payload = {
    order_no: submitData.order_no,
    rush: submitData.rush,
    reason: submitData.reason,
    date_needed: dayjs(submitData.date_needed).format("YYYY-MM-DD"),
    customer: {
      id: submitData?.customer?.id,
      code: submitData?.customer?.id,
      fullName: submitData?.customer?.branchName,
      businessName: submitData?.customer?.businessName,
      phoneNumber: submitData?.customer?.phoneNumber,
      ownersAddress: submitData?.customer_address,
      businessAddress: submitData?.delivery_address,
      tinNumber: submitData?.tin,
      poNumber: submitData?.po_number,
      discountReg:
        Number(String(submitData?.reg_discount).replace(/%/g, "")) / 100,
      discountSpecial:
        Number(String(submitData?.sp_discount).replace(/%/g, "")) / 100,
    },
    charging:
      submitData.charging?.charging_id !== undefined
        ? {
            id: submitData.charging?.charging_id,
            code: submitData.charging?.charging_code,
            name: submitData.charging?.charging_name,
          }
        : {
            id: submitData.charging?.sync_id,
            code: submitData.charging?.code,
            name: submitData.charging?.name,
          },
    company: {
      id: submitData?.charging?.company_id || "",
      code: submitData?.charging?.company_code || "",
      name: submitData?.charging?.company_name || "",
    },
    business_unit: {
      id: submitData?.charging?.business_unit_id || "",
      code: submitData?.charging?.business_unit_code || "",
      name: submitData?.charging?.business_unit_name || "",
    },
    department: {
      id: submitData?.charging?.department_id || "",
      code: submitData?.charging?.department_code || "",
      name: submitData?.charging?.department_name || "",
    },
    department_unit: {
      id: submitData?.charging?.department_unit_id || "",
      code: submitData?.charging?.department_unit_code || "",
      name: submitData?.charging?.department_unit_name || "",
    },
    sub_unit: {
      id: submitData?.charging?.sub_unit_id || "",
      code: submitData?.charging?.sub_unit_code || "",
      name: submitData?.charging?.sub_unit_name || "",
    },
    location: {
      id: submitData?.charging?.location_id || "",
      code: submitData?.charging?.location_code || "",
      name: submitData?.charging?.location_name || "",
    },
    order: submitData.order?.map((items) => ({
      material: {
        id: items?.material?.id,
        code: items?.material?.itemCode,
        name: items?.material?.itemDescription,
      },

      uom: {
        code: items?.uom?.code,
        description: items?.uom?.description,
      },
      quantity: items?.quantity,
      selling_price: Number(String(items?.price).replace(/,/g, "")),
      amount: Number(String(items?.selling_price).replace(/,/g, "")),
      remarks: items?.remarks || "",
    })),
  };

  return payload;
};

export const mapPayloadApproverImport = (submitData, charging) => {
  const chargingValue = charging?.find(
    (c) => c.code === submitData?.charging_code?.toString(),
  );

  const payload = {
    approver_id: submitData?.approver_id || null,
    approver_name: submitData?.approver_name || "",

    charging: {
      id: chargingValue?.id || "",
      code: submitData?.charging_code || "",
      name: submitData?.charging_name || "",
    },

    company: {
      id: chargingValue?.company_id || "",
      code: submitData?.company_code || "",
      name: submitData?.company_name || "",
    },

    business_unit: {
      id: chargingValue?.business_unit_id || "",
      code: submitData?.business_code || "",
      name: submitData?.business_name || "",
    },

    department: {
      id: chargingValue?.department_id || "",
      code: submitData?.department_code || "",
      name: submitData?.department_name || "",
    },

    department_unit: {
      id: chargingValue?.department_unit_id || "",
      code: submitData?.unit_code || "",
      name: submitData?.unit_name || "",
    },

    sub_unit: {
      id: chargingValue?.sub_unit_id || "",
      code: submitData?.subunit_code || "",
      name: submitData?.subunit_name || "",
    },

    location: {
      id: chargingValue?.location_id || "",
      code: submitData?.location_code || "",
      name: submitData?.location_name || "",
    },
  };

  return payload;
};

export const mapPayloadUserImport = (submitData, charging) => {
  const chargingValue = charging?.find(
    (c) => c.code === submitData?.charging?.toString(),
  );
  const scopeValue = charging?.find(
    (c) => c.code === submitData?.scope_order?.toString(),
  );

  const payload = {
    ...submitData,

    charging: {
      id: chargingValue?.id || "",
      code: chargingValue?.code || "",
      name: chargingValue?.name || "",
    },

    company: {
      id: chargingValue?.company_id || "",
      code: chargingValue?.company_code || "",
      name: chargingValue?.company_name || "",
    },

    business_unit: {
      id: chargingValue?.business_unit_id || "",
      code: chargingValue?.business_unit_code || "",
      name: chargingValue?.business_unit_name || "",
    },

    department: {
      id: chargingValue?.department_id || "",
      code: chargingValue?.department_code || "",
      name: chargingValue?.department_name || "",
    },

    department_unit: {
      id: chargingValue?.department_unit_id || "",
      code: chargingValue?.department_unit_code || "",
      name: chargingValue?.department_unit_name || "",
    },

    sub_unit: {
      id: chargingValue?.sub_unit_id || "",
      code: chargingValue?.sub_unit_code || "",
      name: chargingValue?.sub_unit_name || "",
    },

    location: {
      id: chargingValue?.location_id || "",
      code: chargingValue?.location_code || "",
      name: chargingValue?.location_name || "",
    },
    scope_order: {
      charging_id: scopeValue?.sync_id,
      charging_code: scopeValue?.code,
      charging_name: scopeValue?.name,
    },
  };

  return payload;
};

export const mapPayloadUser = (submitData) => {
  const payload = {
    account_code: submitData?.account_code?.general_info?.full_id_number,
    account_name: submitData?.account_name,
    mobile_no: submitData?.mobile_no,
    charging: {
      id: submitData?.charging?.sync_id,
      code: submitData?.charging?.code,
      name: submitData?.charging?.name,
    },
    company: {
      id: submitData?.charging?.company_id,
      code: submitData?.charging?.company_code,
      name: submitData?.charging?.company_name,
    },
    business_unit: {
      id: submitData?.charging?.business_unit_id,
      code: submitData?.charging?.business_unit_code,
      name: submitData?.charging?.business_unit_name,
    },
    department: {
      id: submitData?.charging?.department_id,
      code: submitData?.charging?.department_code,
      name: submitData?.charging?.department_name,
    },
    department_unit: {
      id: submitData?.charging?.department_unit_id,
      code: submitData?.charging?.department_unit_code,
      name: submitData?.charging?.department_unit_name,
    },
    sub_unit: {
      id: submitData?.charging?.sub_unit_id,
      code: submitData?.charging?.sub_unit_code,
      name: submitData?.charging?.sub_unit_name,
    },
    location: {
      id: submitData?.charging?.location_id,
      code: submitData?.charging?.location_code,
      name: submitData?.charging?.location_name,
    },
    role_id: submitData?.role_id?.id,
    order_type_id: submitData?.order_type?.id,
    order_type_code: submitData?.order_type?.code,
    order_type_name: submitData?.order_type?.description,
    username: submitData?.username,
    scope_order: submitData?.scope_order?.map((item) => ({
      charging_id: item?.sync_id,
      charging_code: item?.code,
      charging_name: item?.name,
    })),
    tdo: submitData?.tdo?.id,
    tdo_name: submitData?.tdo?.fullname,
  };

  return payload;
};

export const mapPayloadApprover = (submitData) => {
  const payload = {
    approver:
      submitData?.approver?.map((item) => ({
        approver_id: item?.id,
        approver_name: item?.account_name,
      })) || [],
    charging: {
      id: submitData.charging?.sync_id || "",
      code: submitData.charging?.code || "",
      name: submitData.charging?.name || "",
    },
    company: {
      id: submitData.charging?.company_id || "",
      code: submitData.charging?.company_code || "",
      name: submitData.charging?.company_name || "",
    },
    business_unit: {
      id: submitData.charging?.business_unit_id || "",
      code: submitData.charging?.business_unit_code || "",
      name: submitData.charging?.business_unit_name || "",
    },
    department: {
      id: submitData.charging?.department_id || "",
      code: submitData.charging?.department_code || "",
      name: submitData.charging?.department_name || "",
    },
    department_unit: {
      id: submitData.charging?.department_unit_id || "",
      code: submitData.charging?.department_unit_code || "",
      name: submitData.charging?.department_unit_name || "",
    },
    sub_unit: {
      id: submitData.charging?.sub_unit_id || "",
      code: submitData.charging?.sub_unit_code || "",
      name: submitData.charging?.sub_unit_name || "",
    },
    location: {
      id: submitData.charging?.location_id || "",
      code: submitData.charging?.location_code || "",
      name: submitData.charging?.location_name || "",
    },
  };

  return payload;
};

export const mapOrderingData = (
  ordering,
  charging,
  productData,
  freshTdoData,
  arcanaCustomer,
) => {
  const charge = charging?.find(
    (char) => char?.charging_code === ordering?.charging?.code,
  );

  const cust = arcanaCustomer?.find(
    (item) => item?.id?.toString() === ordering?.customer?.code,
  );

  const customerInfo = {
    branch_name: cust?.businessName,
    customer_address: `${cust?.businessAddress?.houseNumber} ${cust?.businessAddress?.streetName} ${cust?.businessAddress?.barangayName} ${cust?.businessAddress?.city} ${cust?.businessAddress?.province}`,
    delivery_address: `${cust?.businessAddress?.houseNumber} ${cust?.businessAddress?.streetName} ${cust?.businessAddress?.barangayName} ${cust?.businessAddress?.city} ${cust?.businessAddress?.province}`,
    tin: cust?.tinNumber,
    reg_discount: cust?.fixedDiscount ? `${cust?.fixedDiscount}%` : "",
    sp_discount: cust?.sp ? `${cust?.fixedDiscount}%` : "",
  };

  const tdoInfo = freshTdoData?.find((tdo) => tdo?.id === cust?.tdoId);

  const mapData = {
    order_no: ordering?.order_no || "",
    rush: ordering?.rush || "",
    reason: ordering?.reason || "",
    charging: charge,
    customer: cust,
    tdo: tdoInfo,
    date_needed: dayjs(new Date(ordering?.date_needed)),
    ...customerInfo,
    order: ordering?.order?.map((item) => {
      const material = productData?.find(
        (mats) => mats?.itemCode === item?.material?.code,
      );

      const amount = Number(String(item?.amount));
      const sellingPrice = Number(String(item?.selling_price));
      return {
        id: item?.id || new Date(),
        material: material,
        uom: {
          code: item?.uom?.code || "",
          description: item?.uom?.name || "",
        },
        quantity: item?.quantity || 0,
        price: sellingPrice?.toLocaleString("en-US"),
        selling_price: amount?.toLocaleString("en-US"),
        remarks: item?.remarks || "",
      };
    }),
  };

  return mapData || {};
};
