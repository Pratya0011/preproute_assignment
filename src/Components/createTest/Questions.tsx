import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "./createTest.scss";
import { useCreateTestContext } from "./createTestContext";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { FormikProvider, useFormik, FieldArray } from "formik";
import { questionInitialValues } from "./helper";
import * as Yup from "yup";

function Questions() {
  const { contextState }: any = useCreateTestContext();
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
        {/* <FieldArray
              name="skills"
              render={(arrayHelpers: any) => (

              )}
              /> */}
      </FormikProvider>
    </Grid>
  );
}

export default Questions;
