import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Field, FormikProvider, useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { getApi, postApi } from "../../_api/_api";
import "./createTest.scss";
import { initialValues, ISTopic, ISubject, ITopic } from "./helper";
import { useCreateTestContext } from "./createTestContext";

const TEST_TYPES = ["Chapterwise", "PYQ", "Mock Test"];

const breadcrumbSx = {
  color: "#6B7180",
  fontSize: "0.875rem",
  textDecoration: "none",
  "&:hover": {
    color: "#6B7180",
    textDecoration: "underline",
  },
};

function BasicDetails() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { setContextState }: any = useCreateTestContext();
  const [activeType, setActiveType] = useState<string>("Chapterwise");
  const [buttonText, setButtonText] = useState<string>("Save as Draft");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [assessmentData, setAssessmentData] = useState<{
    subjectList: ISubject[];
    topicList: ITopic[];
    subTopicList: ISTopic[];
  }>({
    subjectList: [],
    topicList: [],
    subTopicList: [],
  });

  const createBreadcrumbs = [
    { label: "Test Creation" },
    { label: "Create Test" },
    { label: "Chapter Wise" },
  ];

  const editBreadcrumbs = [
    { label: "Test Creation" },
    { label: "Edit Test Creation" },
  ];

  const breadcrumbs = testId ? editBreadcrumbs : createBreadcrumbs;

  const getSubjectList = async () => {
    const { status, body } = await getApi("/subjects");
    if (status >= 400 && status <= 599) {
      enqueueSnackbar("Failed to fetch subjects", { variant: "error" });
      return;
    }
    setAssessmentData((prev) => ({
      ...prev,
      subjectList: body?.data,
    }));
  };

  const getTopicListBySubjectId = async (subjectId: string) => {
    const { status, body } = await getApi(`/topics/subject/${subjectId}`);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar("Failed to fetch Topics", { variant: "error" });
      return;
    }
    setAssessmentData((prev) => ({
      ...prev,
      topicList: body?.data,
    }));
  };

  const getSubTopicsByTopicIds = async (_topicIds: string[]) => {
    const payload = { topicIds: _topicIds };
    const { status, body } = await postApi("/sub-topics/multi-topics", payload);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar("Failed to fetch Sub Topics", { variant: "error" });
      return;
    }
    setAssessmentData((prev) => ({
      ...prev,
      subTopicList: body?.data,
    }));
  };

  useEffect(() => {
    getSubjectList();
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().required("Field is required"),
    subject: Yup.string().required("Field is required"),
    topics: Yup.array().min(1, "Select at least one topic").required("Field is required"),
    total_time: Yup.number()
      .required("Field is required")
      .min(1, "Must be at least 1"),
    total_questions: Yup.number()
      .required("Field is required")
      .integer("Must be a whole number")
      .min(1, "Must be at least 1"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values: any) => {
      const { map_all_topics, map_all_sub_topics, ...restValues } = values;
      const { status, body } = await postApi("/tests", restValues);
      if (status >= 400 && status <= 599) {
        enqueueSnackbar("Failed to create test", { variant: "error" });
        return;
      }
      setContextState((prev: any) => ({ ...prev, testId: body.data.id }));
      if (buttonText === "Save as Draft") {
        enqueueSnackbar(body.message, { variant: "success" });
        navigate("/dashboard");
      }else{
        setContextState(1)
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue(
      "total_marks",
      formik.values.total_questions * formik.values.correct_marks,
    );
  }, [formik.values.total_questions, formik.values.correct_marks]);

  useEffect(() => {
    const { sub_topics, ...restValues } = formik.values;
    const allFieldsFilled =
      Object.values(restValues).every(
        (value) => value !== "" && value !== null && value !== undefined,
      ) &&
      restValues.total_questions > 0 &&
      restValues.correct_marks > 0;

    setButtonText(allFieldsFilled ? "Next: Add Questions" : "Save as Draft");
  }, [formik.values]);

  return (
    <Grid className="create-test-container">
      <Grid className="create-test-header">
        <Breadcrumbs className="create-test-title">
          {breadcrumbs.map((crumb, index) =>
            index < breadcrumbs.length - 1 ? (
              <Link key={crumb.label} sx={breadcrumbSx} href="#">
                {crumb.label}
              </Link>
            ) : (
              <Typography
                key={crumb.label}
                sx={{ color: "#6B7180", fontSize: "0.875rem" }}
              >
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      </Grid>

      <Grid className="create-test-type-tabs">
        {TEST_TYPES.map((type) => (
          <Button
            key={type}
            type="text"
            className={`create-test-type-tab${activeType === type ? " active" : ""}`}
          >
            {type}
          </Button>
        ))}
      </Grid>

      <FormikProvider value={formik}>
        <Grid container spacing={6} className="form-container">
          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Subject</Typography>
            <Field name="subject">
              {({ field, form, meta }: any) => (
                <Autocomplete
                  className="form-input"
                  options={assessmentData.subjectList}
                  getOptionLabel={(option: any) => option?.name || ""}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id === value.id
                  }
                  value={
                    assessmentData.subjectList.find(
                      (option: any) => option.id === field.value,
                    ) || null
                  }
                  onChange={(_, value) => {
                    form.setFieldValue(field.name, value?.id || "");
                    if (value?.id) {
                      getTopicListBySubjectId(value?.id);
                    } else {
                      form.setFieldValue("topics", []);
                      form.setFieldValue("sub_topics", []);
                      formik.setFieldValue("map_all_topics", false);
                      setAssessmentData((prev) => ({
                        ...prev,
                        topicList: [],
                        subTopicList: [],
                      }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      className="form-input"
                      {...params}
                      label="Choose from Dropdown"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Name of Test</Typography>
            <Field name="name">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter Name of Test"
                  variant="outlined"
                  className="form-input"
                  onChange={(e) => {
                    const trimmedValue = e.target.value;
                    formik.setFieldValue(field.name, trimmedValue);
                  }}
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Topics</Typography>
            <Field name="topics">
              {({ field, form, meta }: any) => (
                <Autocomplete
                  className="form-input"
                  multiple
                  options={assessmentData.topicList}
                  getOptionLabel={(option: any) => option?.name || ""}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id === value.id
                  }
                  value={assessmentData.topicList.filter((ele: any) =>
                    field?.value?.includes(ele.id),
                  )}
                  onChange={(e: any, val: any) => {
                    const isSelectAll = val.find((option: any) => option.all);
                    if (isSelectAll) {
                      if (field.value?.length === assessmentData.topicList?.length) {
                        form.setFieldValue(field.name, []);
                        form.setFieldValue("sub_topics", []);
                        formik.setFieldValue("map_all_topics", false);
                        setAssessmentData((prev: any) => ({ ...prev, subTopicList: [] }));
                      } else {
                        const allIds = assessmentData.topicList.map((each: any) => each?.id);
                        form.setFieldValue(field.name, allIds);
                        form.setFieldValue("sub_topics", []);
                        formik.setFieldValue("map_all_topics", true);
                        getSubTopicsByTopicIds(allIds);
                      }
                    } else {
                      const selectedIds = val.map((ele: any) => ele?.id);
                      form.setFieldValue(field.name, selectedIds);
                      form.setFieldValue("sub_topics", []);
                      formik.setFieldValue("map_all_topics", false);
                      if (selectedIds.length > 0) {
                        getSubTopicsByTopicIds(selectedIds);
                      } else {
                        setAssessmentData((prev: any) => ({ ...prev, subTopicList: [] }));
                      }
                    }
                  }}
                  renderOption={(props: any, option: any, { selected }: any) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={
                          formik.values?.map_all_topics
                            ? formik.values?.map_all_topics
                            : option.all
                              ? field.value?.length === assessmentData.topicList?.length
                              : selected
                        }
                      />
                      {option?.name}
                    </li>
                  )}
                  filterOptions={(options: any[], { inputValue }) => {
                    const lowercaseInput = inputValue.toLowerCase();
                    let filtered = options.filter((option: any) =>
                      option.name.toLowerCase().includes(lowercaseInput),
                    );
                    if (inputValue) {
                      const startsWith = filtered.filter((option: any) =>
                        option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      const contains = filtered.filter(
                        (option: any) =>
                          !option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      startsWith.sort((a: any, b: any) => a.name.length - b.name.length);
                      contains.sort((a: any, b: any) => a.name.length - b.name.length);
                      return [...startsWith, ...contains];
                    }
                    if (!filtered.some((opt) => opt.all) && options.length > 0) {
                      filtered.unshift({ name: "Select All", all: true });
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      className="form-input"
                      {...params}
                      label="Choose from Dropdown"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                  limitTags={2}
                  getLimitTagsText={(more) => `+${more}`}
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Sub Topics</Typography>
            <Field name="sub_topics">
              {({ field, form }: any) => (
                <Autocomplete
                  className="form-input"
                  multiple
                  options={assessmentData.subTopicList}
                  getOptionLabel={(option: any) => option?.name || ""}
                  isOptionEqualToValue={(option: any, value: any) =>
                    option.id === value.id
                  }
                  value={assessmentData.subTopicList.filter((ele: any) =>
                    field?.value?.includes(ele.id),
                  )}
                  onChange={(e: any, val: any) => {
                    const isSelectAll = val.find((option: any) => option.all);
                    if (isSelectAll) {
                      if (field.value?.length === assessmentData.subTopicList?.length) {
                        form.setFieldValue(field.name, []);
                        formik.setFieldValue("map_all_sub_topics", false);
                      } else {
                        const allIds = assessmentData.subTopicList.map((each: any) => each?.id);
                        form.setFieldValue(field.name, allIds);
                        formik.setFieldValue("map_all_sub_topics", true);
                      }
                    } else {
                      const selectedIds = val.map((ele: any) => ele?.id);
                      form.setFieldValue(field.name, selectedIds);
                      formik.setFieldValue("map_all_sub_topics", false);
                    }
                  }}
                  renderOption={(props: any, option: any, { selected }: any) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={
                          formik.values?.map_all_sub_topics
                            ? formik.values?.map_all_sub_topics
                            : option.all
                              ? field.value?.length === assessmentData.subTopicList?.length
                              : selected
                        }
                      />
                      {option?.name}
                    </li>
                  )}
                  filterOptions={(options: any[], { inputValue }) => {
                    const lowercaseInput = inputValue.toLowerCase();
                    let filtered = options.filter((option: any) =>
                      option.name.toLowerCase().includes(lowercaseInput),
                    );
                    if (inputValue) {
                      const startsWith = filtered.filter((option: any) =>
                        option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      const contains = filtered.filter(
                        (option: any) =>
                          !option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      startsWith.sort((a: any, b: any) => a.name.length - b.name.length);
                      contains.sort((a: any, b: any) => a.name.length - b.name.length);
                      return [...startsWith, ...contains];
                    }
                    if (!filtered.some((opt) => opt.all) && options.length > 0) {
                      filtered.unshift({ name: "Select All", all: true });
                    }
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      className="form-input"
                      {...params}
                      label="Choose from Dropdown"
                    />
                  )}
                  limitTags={2}
                  getLimitTagsText={(more) => `+${more}`}
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Duration (Minutes)</Typography>
            <Field name="total_time">
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  fullWidth
                  placeholder="Enter the Time"
                  variant="outlined"
                  className="form-input"
                  value={field.value > 0 ? field.value : null}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    formik.setFieldValue(field.name, trimmedValue);
                  }}
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">Test Difficulty Level</Typography>
            <Field name="difficulty">
              {({ field, form }: any) => (
                <RadioGroup
                  row
                  value={field.value}
                  onChange={(e: any) =>
                    form.setFieldValue(field.name, e.target.value.toLowerCase())
                  }
                >
                  {["Easy", "Medium", "Difficult"].map((level) => (
                    <FormControlLabel
                      key={level}
                      value={level.toLowerCase()}
                      control={<Radio />}
                      label={level}
                    />
                  ))}
                </RadioGroup>
              )}
            </Field>
          </Grid>
        </Grid>

        <Grid container spacing={5} className="marking-scheme-container">
          <Grid size={{ xs: 12 }}>
            <Typography className="marking-scheme-title">Marking Scheme:</Typography>
          </Grid>

          <Grid className="schema-container">
            {[
              { label: "Wrong Answer", name: "wrong_marks" },
              { label: "Unattempted", name: "unattempt_marks" },
              { label: "Correct Answer", name: "correct_marks" },
            ].map(({ label, name }) => (
              <Grid key={name} size={{ xs: 6, sm: "auto" }} className="input-group">
                <Typography className="input-label">{label}</Typography>
                <Field name={name}>
                  {({ field, form }: any) => (
                    <TextField
                      className="form-input"
                      type="number"
                      value={field.value}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        form.setFieldValue(
                          name,
                          field.name === "correct_marks" ? Math.max(0, value) : value,
                        );
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <IconButton
                                size="small"
                                onClick={() => form.setFieldValue(name, field.value + 1)}
                              >
                                <KeyboardArrowUpIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => form.setFieldValue(name, field.value - 1)}
                              >
                                <KeyboardArrowDownIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ),
                        },
                      }}
                    />
                  )}
                </Field>
              </Grid>
            ))}

            <Grid className="input-group" sx={{ flex: 1 }}>
              <Typography className="input-label">No of Questions</Typography>
              <Field name="total_questions">
                {({ field, form, meta }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Ex:50"
                    type="number"
                    value={field.value}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < 0) {
                        form.setFieldValue(field.name, 0);
                        return;
                      }
                      form.setFieldValue(field.name, val);
                    }}
                    error={meta.touched && !!meta.error}
                    helperText={meta.touched && meta.error}
                  />
                )}
              </Field>
            </Grid>

            <Grid sx={{ flex: 1 }} className="input-group">
              <Typography className="input-label" sx={{ color: "#9ca3af" }}>
                Total Marks
              </Typography>
              <Field name="total_marks">
                {({ field }: any) => (
                  <TextField {...field} fullWidth placeholder="Ex:250 Marks" disabled />
                )}
              </Field>
            </Grid>
          </Grid>
        </Grid>

        <Grid className="button-container">
          <Button variant="outlined" onClick={() => setCancelModalOpen(true)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => formik.handleSubmit()}>
            {buttonText}
          </Button>
        </Grid>
      </FormikProvider>

      <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any unsaved changes will be lost. Are you sure you want to cancel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelModalOpen(false)}>Stay</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setCancelModalOpen(false);
              navigate("/dashboard");
            }}
          >
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default BasicDetails;
