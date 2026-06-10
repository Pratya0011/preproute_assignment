import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import EditIcon from "@mui/icons-material/Edit";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postApi, putApi } from "../../_api/_api";
import "./createTest.scss";
import { useCreateTestContext } from "./createTestContext";

const difficultyConfig: Record<string, { bg: string; color: string }> = {
  easy: { bg: "#2AB7A9", color: "#fff" },
  medium: { bg: "#f59e0b", color: "#fff" },
  difficult: { bg: "#ef4444", color: "#fff" },
};

const optionLabels: Record<string, string> = {
  option1: "A",
  option2: "B",
  option3: "C",
  option4: "D",
};

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function Publish() {
  const navigate = useNavigate();
  const { contextState, setContextState }: any = useCreateTestContext();
  const testDetails = contextState?.testDetails;
  const questions = contextState?.questions ?? [];
  const current = contextState?.currentQuestionIndex ?? 0;
  const q = questions[current];
  const isLast = current === questions.length - 1;
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const diffStyle =
    difficultyConfig[testDetails?.difficulty?.toLowerCase()] ??
    difficultyConfig.easy;

  const getQuestionsById = async () => {
    const payload = { question_ids: [...testDetails.questions] };
    const { status, body } = await postApi(`/questions/fetchBulk`, payload);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar(body.message, { variant: "error" });
      return;
    }
    setContextState((prev: any) => ({
      ...prev,
      questions: body.data,
      formQuestionCount: body.data.length,
    }));
  };

  useEffect(() => {
    if (testDetails?.questions?.length && !questions.length) {
      getQuestionsById();
    }
  }, [testDetails]);

  const handleEditQuestions = () => {
    setContextState((prev: any) => ({
      ...prev,
      activeStep: 1,
      type: "addQuestion",
      disabled: false,
      currentQuestionIndex: 0,
      isEdit: true,
    }));
  };

  if (!testDetails) return null;

  return (
    <Box className="publish-container">
      <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEditQuestions}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#e5e7eb",
            color: "#374151",
          }}
        >
          Edit Questions
        </Button>
      </Grid>
      {q && (
        <Paper className="publish-card" elevation={0} variant="outlined">
          <Box className="publish-card-header">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography className="publish-section-title">
                Question {current + 1}
                <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                  /{questions.length}
                </span>
              </Typography>
              {q.difficulty && (
                <Chip
                  label={capitalize(q.difficulty)}
                  size="small"
                  sx={{
                    backgroundColor:
                      difficultyConfig[q.difficulty?.toLowerCase()]?.bg ??
                      "#e5e7eb",
                    color:
                      difficultyConfig[q.difficulty?.toLowerCase()]?.color ??
                      "#374151",
                    fontSize: 12,
                    height: 22,
                  }}
                />
              )}
            </Box>
          </Box>

          <Typography
            className="publish-question-text"
            dangerouslySetInnerHTML={{ __html: q.question }}
            sx={{ mt: 1.5 }}
          />

          <Box className="publish-options-grid" sx={{ mt: 1.5 }}>
            {(["option1", "option2", "option3", "option4"] as const).map(
              (key) => (
                <Box
                  key={key}
                  className={`publish-option${q.correct_option === key ? " correct" : ""}`}
                >
                  <span className="publish-option-label">
                    {optionLabels[key]}
                  </span>
                  <Typography className="publish-option-text">
                    {q[key]}
                  </Typography>
                </Box>
              ),
            )}
          </Box>

          {q.explanation && (
            <Box className="publish-explanation" sx={{ mt: 1.5 }}>
              <Typography className="publish-explanation-label">
                Explanation:
              </Typography>
              <Typography className="publish-explanation-text">
                {q.explanation}
              </Typography>
            </Box>
          )}

          {/* Navigation buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2.5,
              pt: 2,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button
              variant="outlined"
              disabled={current === 0}
              onClick={() =>
                setContextState((prev: any) => ({
                  ...prev,
                  currentQuestionIndex: current - 1,
                }))
              }
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#e5e7eb",
                color: "#374151",
              }}
            >
              Previous Question
            </Button>

            {!isLast && (
              <Button
                variant="contained"
                onClick={() =>
                  setContextState((prev: any) => ({
                    ...prev,
                    currentQuestionIndex: current + 1,
                  }))
                }
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#384ec7",
                }}
              >
                View Next Question
              </Button>
            )}
          </Box>
        </Paper>
      )}
      <Grid sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF7F7F !important",
            "&:hover": { backgroundColor: "#ff6666" },
          }}
          onClick={() => setExitModalOpen(true)}
        >
          Exit
        </Button>
      </Grid>

      <Dialog
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: "16px", padding: "8px", maxWidth: 400 },
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              pt: 2,
              pb: 1,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "#fff3f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningAmberRoundedIcon
                sx={{ color: "#FF7F7F", fontSize: 36 }}
              />
            </Box>
            <Typography
              sx={{ fontSize: 18, fontWeight: 700, color: "#07013c" }}
            >
              Exit Preview?
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Are you sure you want to leave? You can always come back to
              publish.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setExitModalOpen(false)}
            sx={{
              borderRadius: "10px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#e5e7eb",
              color: "#374151",
              "&:hover": { borderColor: "#d1d5db", background: "#f9fafb" },
            }}
          >
            Stay
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setExitModalOpen(false);
              navigate("/dashboard");
            }}
            sx={{
              borderRadius: "10px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#FF7F7F",
              "&:hover": { backgroundColor: "#ff6666" },
            }}
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Publish;
