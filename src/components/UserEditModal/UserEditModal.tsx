import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { Employ } from "types/employees";

type UserEditModal = {
  open: boolean;
  data: { user: Employ, field: string} | null,
  onClose: () => void,
  onSave: (arg: Employ) => void,
}

const UserEditModal:React.FC<UserEditModal> = ({ data, open, onClose, onSave }: UserEditModal) => {
  const [loading, setLoading] = useState(false);
  const [textArea, setTextArea] = useState<string>('');

  const handleSave = () => {
    setLoading(true);
    if(data) {
      const employ:Employ = data.user;
      if(data && data.field === 'last_status') {
        employ[data.field] = JSON.parse(textArea);
      } else {
        employ[data.field] = textArea;
      }

      if(employ.comments.length === 0) {
        employ.comments = "no comments";
      }
      
      onSave(employ);
    }
    setLoading(false);
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(e.target.value);
  }

  const computeValue = () => {
    if (data && data.field === 'comments') {
      return data.user[data.field] ? data.user[data.field] : 'No row data'
    }
    if (data && data.field === 'last_status') {
      return data.user[data.field] ? JSON.stringify(data.user[data.field]) : 'No row data'
    }
  }

  return <Modal
  open={open}
  onClose={onClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      height: 300,
      bgcolor: "background.paper",
      boxShadow: 24,
      border: "2px solid #000",
      p: 2,
    }}
  >
    <Typography id="modal-modal-title" variant="h6" component="h2">
      {data && data.field ? data.field : 'Row'} Edit
    </Typography>
    <TextareaAutosize
      onChange={handleTextAreaChange}
      maxRows={3}
      minRows={3}
      aria-label="maximum height"
      placeholder="Maximum 4 rows"
      defaultValue={computeValue()}
      style={{ width: 400, height: 200, resize: 'none' }}
    />
    <LoadingButton
        color="secondary"
        onClick={handleSave}
        loading={loading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
      >
        Save
      </LoadingButton>
  </Box>
</Modal>
}

export { UserEditModal }