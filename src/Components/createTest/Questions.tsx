import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import * as Yup from "yup";
import "./createTest.scss";
import { useCreateTestContext } from "./createTestContext";
import { questionInitialValues } from "./helper";

function Questions() {
  const { contextState, setContextState }: any = useCreateTestContext();
  const current = contextState?.currentQuestionIndex ?? 0;
  const total = contextState?.testDetails?.total_questions ?? 0;
  const testDetails = contextState?.testDetails;

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
    "question", "option1", "option2", "option3", "option4",
    "correct_option", "explanation", "difficulty",
  ];

  const schema = Yup.object().shape({
    questions: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required("Type is required"),
        question: Yup.string().required("Question is required"),
        option1: Yup.string().required("Option 1 is required"),
        option2: Yup.string().required("Option 2 is required"),
        option3: Yup.string().required("Option 3 is required"),
        option4: Yup.string().required("Option 4 is required"),
        correct_option: Yup.string().required("Correct option is required"),
        explanation: Yup.string().required("Explanation is required"),
        difficulty: Yup.string().required("Difficulty is required"),
        test_id: Yup.string().required("Test ID is required"),
      }),
    ),
  });

  const formik = useFormik({
    initialValues: {
      questions: [
        { ...questionInitialValues, test_id: contextState?.testId ?? "" },
      ],
    },
    validationSchema: schema,
    onSubmit: async (values: any) => {},
  });

    const handleNext = async (arrayHelpers: any) => {
    QUESTION_FIELDS.forEach((field) =>
      formik.setFieldTouched(`questions[${current}].${field}`, true, false),
    );
    const errors = await formik.validateForm();
    const hasErrors = (errors.questions as any)?.[current];
    if (!hasErrors) {
      arrayHelpers.replace(current, formik.values.questions[current]);

      const updatedQuestions = [...(contextState?.questions ?? [])];
      updatedQuestions[current] = formik.values.questions[current];

      if (current + 1 >= formik.values.questions.length && formik.values.questions.length <= testDetails.total_questions) {
        arrayHelpers.push({ ...questionInitialValues, test_id: contextState?.testId ?? "" });
      }
      setContextState((prev: any) => ({
        ...prev,
        currentQuestionIndex: current + 1,
        questions: updatedQuestions,
      }));
    }
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
          >
            MCQ
          </Button>
          <Button
            variant="text"
            startIcon={<FileDownloadOutlinedIcon />}
            className="question-action-btn"
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
        >
          Delete All Edits
        </Button>
      </Grid>

      <FormikProvider value={formik}>
        <FieldArray
          name="questions"
          render={(arrayHelpers: any) => {
            return (
              <Grid className="fieldarray-question-container">
                {formik.values.questions[current] && (() => {
                  const item = formik.values.questions[current];
                  const index = current;
                  return (
                    <>
                      <Box key={index} sx={{ position: "relative" }}>
                        <Field name={`questions[${index}].question`}>
                          {({ field, form }: any) => (
                            <ReactQuill
                              theme="snow"
                              modules={module}
                              className="quill-text"
                              style={{ height: "20vh" }}
                              value={field.value}
                              onChange={(e: any) => {
                                form.setFieldValue(field.name, e);
                              }}
                            />
                          )}
                        </Field>
                        <IconButton
                          size="small"
                          className="option-delete-btn"
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
                          ["option1", "option2", "option3", "option4"] as const
                        ).map((optionKey) => (
                          <Grid key={optionKey} className="option-row">
                            <Radio
                              className="option-radio"
                              checked={item.correct_option === optionKey}
                              onChange={() =>
                                formik.setFieldValue(`questions[${index}].correct_option`, optionKey)
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
                                  error={meta.touched && !!meta.error}
                                  helperText={meta.touched && meta.error}
                                />
                              )}
                            </Field>
                            <IconButton
                              className="option-delete-btn"
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
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && meta.error}
                              slotProps={{
                                input: {
                                  endAdornment: (
                                    <IconButton
                                      size="small"
                                      className="option-delete-btn"
                                      onClick={() =>
                                        formik.setFieldValue(
                                          `questions[${index}].explanation`,
                                          "",
                                        )
                                      }
                                      sx={{ alignSelf: "flex-start", mt: 0.5 }}
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
                            Sub-topic
                          </Typography>
                          <Field name={`questions[${index}].sub_topic`}>
                            {({ field, form, meta }: any) => (
                              <Autocomplete
                                options={
                                  contextState?.testDetails?.sub_topics ?? []
                                }
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
                        {formik.values.questions.length <= testDetails.total_questions&& (<Button variant="contained" sx={{ backgroundColor: "#FF7F7F !important", "&:hover": { backgroundColor: "#ff6666" } }}>Exit Test Creation</Button>)}
                        <Button variant="contained" onClick={() => handleNext(arrayHelpers)}>Next</Button>
                      </Grid>
                    </>
                  );
                })()}
              </Grid>
            );
          }}
        />
      </FormikProvider>
    </Grid>
  );
}

export default Questions;
