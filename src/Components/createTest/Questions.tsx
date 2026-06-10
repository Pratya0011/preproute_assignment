import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import * as Yup from "yup";
import { postApi, putApi } from "../../_api/_api";
import "./createTest.scss";
import { useCreateTestContext } from "./createTestContext";
import CSVUploadModal from "./CSVUploadModal";
import { questionInitialValues } from "./helper";

function Questions() {
  const { contextState, setContextState }: any = useCreateTestContext();
  const navigate = useNavigate();
  const current = contextState?.currentQuestionIndex ?? 0;
  const total = contextState?.testDetails?.total_questions ?? 0;
  const testDetails = contextState?.testDetails;
  const disabled = contextState?.disabled ?? false;
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ size: ["small", false, "large", "huge"] }],
    ["image"],
  ];

  const module = {
    toolbar: toolbarOptions,
  };

  const QUESTION_FIELDS = [
    "question",
    "option1",
    "option2",
    "option3",
    "option4",
    "correct_option",
    "explanation",
    "difficulty",
  ];

  const schema = Yup.object().shape({
    questions: Yup.array()
      .min(1, "At least 1 question is required")
      .of(
        Yup.object().shape({
          type: Yup.string().required("Type is required"),
          question: Yup.string().required("Question is required"),
          option1: Yup.string().required("Option 1 is required"),
          option2: Yup.string().required("Option 2 is required"),
          option3: Yup.string().required("Option 3 is required"),
          option4: Yup.string().required("Option 4 is required"),
          correct_option: Yup.string().required("Correct option is required"),
          difficulty: Yup.string(),
          test_id: Yup.string().required("Test ID is required"),
        }),
      ),
  });

  const formik = useFormik({
    initialValues: {
      questions: [] as any[],
    },
    validationSchema: schema,
    onSubmit: async (values: any) => {
      let questionData: any = [];
      const questions = values.questions.map(
        ({ topic, sub_topic, ...rest }: any) => rest,
      );
      if (!contextState.isEdit) {
        const { status, body } = await postApi("/questions/bulk", {
          questions,
        });
        if (status >= 400 && status <= 599) {
          enqueueSnackbar("Failed to create Question", { variant: "error" });
          return;
        }
        questionData = [...body.data];
      }
      await putApi(`/tests/${contextState.testId}`, {
        status: "unpublished",
      });

      setContextState((prev: any) => ({
        ...prev,
        disabled: true,
        questions: questionData,
        type: "publishTest",
      }));
    },
  });

  const getQuestionsById = async () => {
    const payload = { question_ids: [...testDetails.questions] };
    const { status, body } = await postApi(`/questions/fetchBulk`, payload);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar(body.message, { variant: "error" });
      return;
    }
    const questions = (body.data ?? []).map((q: any) => ({
      type: q.type ?? "mcq",
      question: q.question ?? "",
      option1: q.option1 ?? "",
      option2: q.option2 ?? "",
      option3: q.option3 ?? "",
      option4: q.option4 ?? "",
      correct_option: q.correct_option ?? "",
      explanation: q.explanation ?? "",
      difficulty: q.difficulty ?? "",
      test_id: q.test_id ?? contextState?.testId ?? "",
      subject: q.subject ?? "",
      topic: q.topic ?? "",
      sub_topic: q.sub_topic ?? "",
    }));
    formik.setFieldValue("questions", questions);
    setContextState((prev: any) => ({
      ...prev,
      questions: body.data,
      formQuestionCount: questions.length,
    }));
  };

  useEffect(() => {
    if (contextState.isEdit) {
      getQuestionsById();
    }
  }, []);

  useEffect(() => {
    setContextState((prev: any) => ({
      ...prev,
      formQuestionCount: formik.values.questions.length,
    }));
  }, [formik.values.questions.length]);

  const handleDelete = () => {
    const questions = formik.values.questions;
    if (questions.length <= 1) return;

    const newQuestions = questions.filter((_: any, i: number) => i !== current);
    formik.setFieldValue("questions", newQuestions);

    const newContextQuestions = (contextState?.questions ?? []).filter(
      (_: any, i: number) => i !== current,
    );
    const newIndex =
      current >= newQuestions.length ? newQuestions.length - 1 : current;

    setContextState((prev: any) => ({
      ...prev,
      currentQuestionIndex: newIndex,
      questions: newContextQuestions,
    }));
  };

  const handleNext = async () => {
    QUESTION_FIELDS.forEach((field) =>
      formik.setFieldTouched(`questions[${current}].${field}`, true, false),
    );
    const errors = await formik.validateForm();
    const hasErrors = (errors.questions as any)?.[current];
    if (hasErrors) {
      enqueueSnackbar("Please correct the validation", { variant: "error" });
      return;
    }
    if (!hasErrors) {
      const updatedFormQuestions = [...formik.values.questions];
      updatedFormQuestions.splice(current + 1, 0, {
        ...questionInitialValues,
        test_id: contextState?.testId ?? "",
        subject: testDetails?.subject ?? "",
      });
      formik.setFieldValue("questions", updatedFormQuestions);

      const updatedQuestions = [...(contextState?.questions ?? [])];
      updatedQuestions[current] = formik.values.questions[current];
      updatedQuestions.splice(current + 1, 0, undefined as any);

      setContextState((prev: any) => ({
        ...prev,
        currentQuestionIndex: current + 1,
        questions: updatedQuestions,
      }));
    }
  };

  const handleAddMCQ = () => {
    const newQuestion = {
      ...questionInitialValues,
      test_id: contextState?.testId ?? "",
      subject: testDetails?.subject ?? "",
    };
    const updated = [...formik.values.questions, newQuestion];
    formik.setFieldValue("questions", updated);
    setContextState((prev: any) => ({
      ...prev,
      currentQuestionIndex: updated.length - 1,
    }));
  };

  return (
    <Grid className="question-editor">
      <Grid className="question-editor-header">
        <Typography className="question-counter">
          Question {current + 1}
          <span className="question-counter-total">/{total}</span>
        </Typography>
        <Grid className="question-editor-actions">
          <Button
            variant="text"
            startIcon={<AddIcon />}
            className="question-action-btn"
            onClick={handleAddMCQ}
          >
            MCQ
          </Button>
          <Button
            variant="text"
            startIcon={<FileDownloadOutlinedIcon />}
            className="question-action-btn"
            onClick={() => setCsvModalOpen(true)}
          >
            CSV
          </Button>
        </Grid>
      </Grid>

      <Grid className="question-delete-header">
        <Button
          variant="text"
          startIcon={<DeleteOutlinedIcon />}
          className="question-delete-btn"
          onClick={handleDelete}
          disabled={disabled || formik.values.questions.length <= 1}
        >
          Delete All Edits
        </Button>
        {contextState.disabled && (
          <Button
            variant="text"
            startIcon={<EditIcon fontSize="small" />}
            className="question-delete-btn"
            onClick={() =>
              setContextState((prev: any) => ({
                ...prev,
                disabled: false,
              }))
            }
          >
            Enable edit Question
          </Button>
        )}
      </Grid>

      <FormikProvider value={formik}>
        <FieldArray
          name="questions"
          render={() => {
            return (
              <Grid className="fieldarray-question-container">
                {formik.values.questions[current] &&
                  (() => {
                    const item = formik.values.questions[current];
                    const index = current;
                    return (
                      <>
                        <Box key={index} sx={{ position: "relative" }}>
                          <Field name={`questions[${index}].question`}>
                            {({ field, form }: any) => (
                              <ReactQuill
                                theme="snow"
                                modules={disabled ? { toolbar: false } : module}
                                readOnly={disabled}
                                className="quill-text"
                                style={{ height: "20vh" }}
                                value={field.value}
                                onChange={(e: any) => {
                                  if (!disabled)
                                    form.setFieldValue(field.name, e);
                                }}
                              />
                            )}
                          </Field>
                          <IconButton
                            size="small"
                            className="option-delete-btn"
                            disabled={disabled}
                            onClick={() =>
                              formik.setFieldValue(
                                `questions[${index}].question`,
                                "",
                              )
                            }
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              zIndex: 1,
                            }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Grid className="options-container">
                          <Typography className="options-label">
                            Type the options below
                          </Typography>
                          {(
                            [
                              "option1",
                              "option2",
                              "option3",
                              "option4",
                            ] as const
                          ).map((optionKey) => (
                            <Grid key={optionKey} className="option-row">
                              <Radio
                                className="option-radio"
                                checked={item.correct_option === optionKey}
                                disabled={disabled}
                                onChange={() =>
                                  formik.setFieldValue(
                                    `questions[${index}].correct_option`,
                                    optionKey,
                                  )
                                }
                              />
                              <Field name={`questions[${index}].${optionKey}`}>
                                {({ field, meta }: any) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    placeholder="Type Option here"
                                    className="option-input"
                                    variant="outlined"
                                    size="small"
                                    disabled={disabled}
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && meta.error}
                                  />
                                )}
                              </Field>
                              <IconButton
                                className="option-delete-btn"
                                disabled={disabled}
                                onClick={() =>
                                  formik.setFieldValue(
                                    `questions[${index}].${optionKey}`,
                                    "",
                                  )
                                }
                              >
                                <DeleteOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Grid>
                          ))}
                        </Grid>

                        <Grid className="options-container">
                          <Typography className="options-label">
                            Add Solution
                          </Typography>
                          <Field name={`questions[${index}].explanation`}>
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={8}
                                placeholder="Type here..."
                                variant="outlined"
                                disabled={disabled}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                                slotProps={{
                                  input: {
                                    endAdornment: (
                                      <IconButton
                                        size="small"
                                        className="option-delete-btn"
                                        disabled={disabled}
                                        onClick={() =>
                                          formik.setFieldValue(
                                            `questions[${index}].explanation`,
                                            "",
                                          )
                                        }
                                        sx={{
                                          alignSelf: "flex-start",
                                          mt: 0.5,
                                        }}
                                      >
                                        <DeleteOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    ),
                                  },
                                }}
                              />
                            )}
                          </Field>
                        </Grid>

                        <Grid className="options-container">
                          <Typography className="options-label">
                            Media URL (Optional)
                          </Typography>
                          <Field name={`questions[${index}].media_url`}>
                            {({ field, meta }: any) => (
                              <TextField
                                {...field}
                                fullWidth
                                placeholder="Paste image or media URL here..."
                                variant="outlined"
                                disabled={disabled}
                                error={meta.touched && !!meta.error}
                                helperText={meta.touched && meta.error}
                              />
                            )}
                          </Field>
                        </Grid>

                        <Grid className="question-settings-container">
                          <Typography className="question-settings-title">
                            Question settings
                          </Typography>

                          <Grid className="question-settings-field">
                            <Typography className="question-settings-label">
                              Level of Difficulty
                            </Typography>
                            <Field name={`questions[${index}].difficulty`}>
                              {({ field, form, meta }: any) => (
                                <Autocomplete
                                  options={["easy", "medium", "difficult"]}
                                  disabled={disabled}
                                  getOptionLabel={(option) =>
                                    option.charAt(0).toUpperCase() +
                                    option.slice(1)
                                  }
                                  value={field.value || null}
                                  onChange={(_, value) =>
                                    form.setFieldValue(field.name, value ?? "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select from Drop-down"
                                      error={meta.touched && !!meta.error}
                                      helperText={meta.touched && meta.error}
                                    />
                                  )}
                                />
                              )}
                            </Field>
                          </Grid>

                          <Grid className="question-settings-field">
                            <Typography className="question-settings-label">
                              Topic
                            </Typography>
                            <Field name={`questions[${index}].topic`}>
                              {({ field, form, meta }: any) => (
                                <Autocomplete
                                  options={
                                    contextState?.testDetails?.topics ?? []
                                  }
                                  disabled={disabled}
                                  getOptionLabel={(option: any) =>
                                    option?.name ?? option
                                  }
                                  value={field.value || null}
                                  onChange={(_, value) =>
                                    form.setFieldValue(field.name, value ?? "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select from Drop-down"
                                    />
                                  )}
                                />
                              )}
                            </Field>
                          </Grid>

                          <Grid className="question-settings-field">
                            <Typography className="question-settings-label">
                              Sub-topic
                            </Typography>
                            <Field name={`questions[${index}].sub_topic`}>
                              {({ field, form, meta }: any) => (
                                <Autocomplete
                                  options={
                                    contextState?.testDetails?.sub_topics ?? []
                                  }
                                  disabled={disabled}
                                  getOptionLabel={(option: any) =>
                                    option?.name ?? option
                                  }
                                  value={field.value || null}
                                  onChange={(_, value) =>
                                    form.setFieldValue(field.name, value ?? "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select from Drop-down"
                                    />
                                  )}
                                />
                              )}
                            </Field>
                          </Grid>
                        </Grid>

                        <Grid className="btn-container">
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#FF7F7F !important",
                              "&:hover": { backgroundColor: "#ff6666" },
                            }}
                            onClick={() => setExitModalOpen(true)}
                          >
                            Exit Test Creation
                          </Button>
                          <Grid sx={{ display: "flex", gap: 2 }}>
                            {current !== 0 && (
                              <Button
                                variant="contained"
                                onClick={() =>
                                  setContextState((prev: any) => ({
                                    ...prev,
                                    currentQuestionIndex: current - 1,
                                  }))
                                }
                              >
                                Previous Question
                              </Button>
                            )}
                            {!disabled &&
                              formik.values.questions.length <
                                testDetails.total_questions && (
                                <Button
                                  variant="contained"
                                  onClick={() => handleNext()}
                                >
                                  Add Another Question
                                </Button>
                              )}

                            <Button
                              variant="contained"
                              onClick={() => formik.handleSubmit()}
                            >
                              Save and Continue
                            </Button>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })()}
              </Grid>
            );
          }}
        />
      </FormikProvider>

      <CSVUploadModal
        open={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        testId={contextState?.testId ?? ""}
        subject={testDetails?.subject ?? ""}
        onQuestionsLoaded={(parsed) => {
          const existing = formik.values.questions.filter(
            (q: any) => q.question.trim() !== "",
          );
          formik.setFieldValue("questions", [...existing, ...parsed]);
          setContextState((prev: any) => ({
            ...prev,
            formQuestionCount: existing.length + parsed.length,
            questions: [...parsed],
          }));
        }}
      />

      <Dialog
        open={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: "16px", padding: "8px", maxWidth: 400 },
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
              Exit Test Creation?
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Any unsaved progress will be lost. Are you sure you want to leave?
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
    </Grid>
  );
}

export default Questions;
