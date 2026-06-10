import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { IQuestionForm } from "./helper";

interface Props {
  open: boolean;
  onClose: () => void;
  onQuestionsLoaded: (questions: IQuestionForm[]) => void;
  testId: string;
  subject: string;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

function CSVUploadModal({ open, onClose, onQuestionsLoaded, testId, subject }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFileName(null);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const parseAndLoad = (file: File) => {
    setError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setError("File exceeds 5MB limit.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!rows.length) {
          setError("File is empty or has no readable rows.");
          return;
        }

        const questions: IQuestionForm[] = rows
          .filter((row) => row.question || row.Question)
          .map((row) => ({
            type: "mcq",
            question: String(row.question || row.Question || ""),
            option1: String(row.option1 || row.Option1 || ""),
            option2: String(row.option2 || row.Option2 || ""),
            option3: String(row.option3 || row.Option3 || ""),
            option4: String(row.option4 || row.Option4 || ""),
            correct_option: String(row.correct_option || row.CorrectOption || ""),
            explanation: String(row.explanation || row.Explanation || ""),
            difficulty: String(row.difficulty || row.Difficulty || "easy"),
            media_url: String(row.media_url || row.MediaUrl || ""),
            test_id: testId,
            subject,
          }));

        if (!questions.length) {
          setError("No valid questions found. Make sure your file has a 'question' column.");
          return;
        }

        enqueueSnackbar(`${questions.length} question(s) loaded from file`, { variant: "success" });
        onQuestionsLoaded(questions);
        handleClose();
      } catch {
        setError("Failed to parse file. Please check the format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseAndLoad(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseAndLoad(file);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "16px", padding: "8px" } } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#07013c" }}>
          Upload File
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: `2px dashed ${isDragging ? "#384ec7" : "#d1d5db"}`,
            borderRadius: "12px",
            backgroundColor: isDragging ? "#f0f3ff" : "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": { borderColor: "#384ec7", backgroundColor: "#f0f3ff" },
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: "#384ec7", mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
            {fileName ? fileName : "Drag & Drop your files here"}
          </Typography>
          {!fileName && (
            <>
              <Typography sx={{ color: "#6b7280", fontSize: 14, my: 0.5 }}>OR</Typography>
              <Typography
                sx={{ color: "#384ec7", fontWeight: 600, fontSize: 14, textDecoration: "underline" }}
              >
                Browse File
              </Typography>
            </>
          )}
          {fileName && (
            <Typography sx={{ color: "#22c55e", fontSize: 13, mt: 0.5 }}>
              File selected — click to change
            </Typography>
          )}
        </Box>

        {error && (
          <Typography sx={{ color: "#ef4444", fontSize: 13, mt: 1.5 }}>{error}</Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>
            Supported formats: XLS, XLSX, CSV
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>Maximum size: 5MB</Typography>
        </Box>

        <Box sx={{ mt: 2, p: 1.5, backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#374151", mb: 0.5 }}>
            Expected columns:
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace" }}>
            question, option1, option2, option3, option4, correct_option, explanation, difficulty, media_url
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: 0.5 }}>
            correct_option values: option1 / option2 / option3 / option4
          </Typography>
        </Box>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CSVUploadModal;
