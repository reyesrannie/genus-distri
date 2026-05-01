import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const handleScroll = (e, fn) => {
  const listboxNode = e.currentTarget;
  const { scrollTop, scrollHeight, clientHeight } = listboxNode;

  if (scrollTop + clientHeight >= scrollHeight - 1) {
    fn();
  }
};

export function mergeUniqueByKey(array1, array2, key) {
  const a1 = Array.isArray(array1) ? array1 : [];
  const a2 = Array.isArray(array2) ? array2 : [];
  const map = new Map();

  [...a1, ...a2].forEach((item) => {
    if (item && item[key] !== undefined) {
      map.set(item[key], item);
    }
  });

  return Array.from(map.values());
}

export const readExcelItems = (data = [], mappingValue = []) => {
  const payload = data?.map((item) => {
    const obj = {};
    mappingValue?.forEach((mapping) => {
      obj[mapping?.name] = item[mapping?.value];
    });
    return obj;
  });

  return payload;
};

export const readExcelItemsMaterials = (
  data = [],
  mappingValue = [],
  accountTitle = []
) => {
  const groupedResult = {};

  data?.forEach((item) => {
    let groupKey = null;
    const mappedItem = {};

    mappingValue?.forEach((mapping) => {
      const key = mapping.name;
      const value = item[mapping.value];

      if (key === "account_title") {
      } else {
        mappedItem[key] = value;
        if (key === "code") {
          groupKey = value;
        }
      }
    });

    if (!groupKey) return;

    if (!groupedResult[groupKey]) {
      groupedResult[groupKey] = {
        ...mappedItem,
        account_title: [],
      };
    }

    const accountTitleMapping = mappingValue.find(
      (m) => m.name === "account_title"
    );
    if (accountTitleMapping) {
      const accTitleId = item[accountTitleMapping.value];
      if (accTitleId) {
        groupedResult[groupKey].account_title.push({
          account_title_id: accountTitle?.find((at) => at?.name === accTitleId)
            ?.id,
        });
      }
    }
  });

  return Object.values(groupedResult);
};

export const readExcelFile = async (files) => {
  if (files.length > 0) {
    const file = files[0];
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(file);
    const worksheet = workbook.getWorksheet(1);
    const headers = worksheet.getRow(1).values;
    const rows = [];
    worksheet.eachRow((row, rowNum) => {
      if (rowNum !== 1) {
        const rowData = {};
        row.eachCell((cell, colNum) => {
          rowData[headers[colNum]] = cell.value;
        });
        rows.push(rowData);
      }
    });
    return rows;
  } else {
    return null;
  }
};

export const filterMaterials = (materialsData, search = "") => {
  const lowerSearch = search?.toLowerCase();

  return materialsData?.filter((item) => {
    const codeStr = String(item.code)?.toLowerCase();
    const nameStr = item?.name?.toLowerCase();

    return codeStr.includes(lowerSearch) || nameStr.includes(lowerSearch);
  });
};

export const hasOrderChanged = (originalOrder, newOrder) => {
  if (originalOrder.length !== newOrder.length) return true;

  for (let i = 0; i < originalOrder.length; i++) {
    const orig = originalOrder[i];
    const curr = newOrder[i];

    if (orig.quantity !== curr.quantity) return true;
    if (orig?.material?.code !== curr?.material?.code) return true;
  }

  return false;
};

export const groupByCharging = (data) => {
  const grouped = [];

  data.forEach((item) => {
    const key = item.charging.id;
    const existing = grouped.find((g) => g.charging.id === key);

    const approver = {
      approver_id: item.approver_id,
      approver_name: item.approver_name,
    };

    if (existing) {
      if (
        !existing?.approver?.some((a) => a.approver_id === approver.approver_id)
      ) {
        existing?.approver?.push(approver);
      }
    } else {
      grouped.push({
        charging: item.charging,
        company: item.company,
        business_unit: item.business_unit,
        department: item.department,
        department_unit: item.department_unit,
        sub_unit: item.sub_unit,
        location: item.location,
        approver: [approver],
      });
    }
  });

  return grouped;
};

export const groupByAccountWithScopeOrderArray = (data) => {
  const grouped = [];

  data.forEach((item) => {
    const key = item.account_code;

    const existing = grouped.find((g) => g.account_code === key);

    if (existing) {
      const exists = existing.scope_order.some(
        (s) => s.charging_id === item.scope_order.charging_id
      );
      if (!exists) {
        existing.scope_order.push(item.scope_order);
      }
    } else {
      grouped.push({
        ...item,
        scope_order: [item.scope_order],
      });
    }
  });

  return grouped;
};

export const exportExcel = async (data, exportHeader, filename) => {
  const checkValue = () => {};

  const file = data.flatMap((transaction) =>
    transaction?.orders?.map((order) => {
      const row = {};

      exportHeader.forEach((header) => {
        const source = header.source === "transaction" ? transaction : order;
        let value = source?.[header.value] ?? "";
        if (header.type === "date" && value) {
          value = dayjs(value).format("YYYY-MM-DD");
        }

        row[header.name] = value;
      });

      return row;
    })
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  worksheet.columns = exportHeader.map((header) => ({
    header: header?.name,
    key: header?.name,
    width: 20,
  }));

  file.forEach((row) => {
    worksheet.addRow(row);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
};
