import { Chip, Dialog, DialogContent, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";

const MultipleViewApprovalModal = () => {
  const dispatch = useDispatch();
  const multipleView = useSelector((state) => state.modal.multipleView);
  const multipleData = useSelector((state) => state.modal.multipleData);

  return (
    <Dialog open={multipleView} onClose={() => dispatch(resetModal())}>
      <DialogContent>
        <Stack
          gap={1}
          padding={1}
          sx={{
            border: "2px dashed #E0E0E0",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {multipleData?.map((item) => {
            return <Chip label={`${item?.approver_name}`} key={item?.id} />;
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleViewApprovalModal;
