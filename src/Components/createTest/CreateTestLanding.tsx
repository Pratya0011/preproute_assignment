import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
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
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { getApi, postApi } from "../../_api/_api";
import "./createTest.scss";
import { initialValues, ISTopic, ISubject, ITopic } from "./helper";

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

function CreateTestLanding() {
  const { testId } = useParams();
  const [activeType, setActiveType] = useState("Chapterwise");
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
    const payload = {
      topicIds: _topicIds,
    };
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
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values: any) => {
      console.log(values);
    },
  });

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
            //   onClick={() => setActiveType(type)}
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
                      if (
                        field.value?.length === assessmentData.topicList?.length
                      ) {
                        form.setFieldValue(field.name, []);
                        form.setFieldValue("sub_topics", []);
                        formik.setFieldValue("map_all_topics", false);
                        setAssessmentData((prev: any) => ({
                          ...prev,
                          subTopicList: [],
                        }));
                      } else {
                        const allIds = assessmentData.topicList.map(
                          (each: any) => each?.id,
                        );
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
                        setAssessmentData((prev: any) => ({
                          ...prev,
                          subTopicList: [],
                        }));
                      }
                    }
                  }}
                  renderOption={(
                    props: any,
                    option: any,
                    { selected }: any,
                  ) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={
                          formik.values?.map_all_topics
                            ? formik.values?.map_all_topics
                            : option.all
                              ? field.value?.length ===
                                assessmentData.topicList?.length
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
                      // Enhanced match priority: startsWith > contains
                      const startsWith = filtered.filter((option: any) =>
                        option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      const contains = filtered.filter(
                        (option: any) =>
                          !option.name.toLowerCase().startsWith(lowercaseInput),
                      );

                      startsWith.sort(
                        (a: any, b: any) => a.name.length - b.name.length,
                      );
                      contains.sort(
                        (a: any, b: any) => a.name.length - b.name.length,
                      );

                      filtered = [...startsWith, ...contains];

                      // Don't show "Select All" during search
                      return filtered;
                    }

                    // Show "Select All" only if not searching and it's not already present
                    if (
                      !filtered.some((opt) => opt.all) &&
                      options.length > 0
                    ) {
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
            <Typography className="input-label">Sub Topics</Typography>
            <Field name="sub_topics">
              {({ field, form, meta }: any) => (
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
                      if (
                        field.value?.length ===
                        assessmentData.subTopicList?.length
                      ) {
                        form.setFieldValue(field.name, []);
                        formik.setFieldValue("map_all_sub_topics", false);
                      } else {
                        const allIds = assessmentData.subTopicList.map(
                          (each: any) => each?.id,
                        );
                        form.setFieldValue(field.name, allIds);
                        formik.setFieldValue("map_all_sub_topics", true);
                      }
                    } else {
                      const selectedIds = val.map((ele: any) => ele?.id);
                      form.setFieldValue(field.name, selectedIds);
                      formik.setFieldValue("map_all_sub_topics", false);
                    }
                  }}
                  renderOption={(
                    props: any,
                    option: any,
                    { selected }: any,
                  ) => (
                    <li {...props}>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={
                          formik.values?.map_all_sub_topics
                            ? formik.values?.map_all_sub_topics
                            : option.all
                              ? field.value?.length ===
                                assessmentData.subTopicList?.length
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
                      // Enhanced match priority: startsWith > contains
                      const startsWith = filtered.filter((option: any) =>
                        option.name.toLowerCase().startsWith(lowercaseInput),
                      );
                      const contains = filtered.filter(
                        (option: any) =>
                          !option.name.toLowerCase().startsWith(lowercaseInput),
                      );

                      startsWith.sort(
                        (a: any, b: any) => a.name.length - b.name.length,
                      );
                      contains.sort(
                        (a: any, b: any) => a.name.length - b.name.length,
                      );

                      filtered = [...startsWith, ...contains];

                      // Don't show "Select All" during search
                      return filtered;
                    }

                    // Show "Select All" only if not searching and it's not already present
                    if (
                      !filtered.some((opt) => opt.all) &&
                      options.length > 0
                    ) {
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
                />
              )}
            </Field>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="input-group">
            <Typography className="input-label">
              Test Difficulty Level
            </Typography>
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
            <Typography className="marking-scheme-title">
              Marking Scheme:
            </Typography>
          </Grid>

          <Grid className="schema-container">
            {[
              { label: "Wrong Answer", name: "wrong_marks" },
              { label: "Unattempted", name: "unattempt_marks" },
              { label: "Correct Answer", name: "correct_marks" },
            ].map(({ label, name }) => (
              <Grid
                key={name}
                size={{ xs: 6, sm: "auto" }}
                className="input-group"
              >
                <Typography className="input-label">{label}</Typography>
                <Field name={name}>
                  {({ field, form }: any) => (
                    <TextField
                      className="form-input"
                      value={field.value}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  form.setFieldValue(name, field.value + 1)
                                }
                              >
                                <KeyboardArrowUpIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  form.setFieldValue(name, field.value - 1)
                                }
                              >
                                <KeyboardArrowDownIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ),
                          readOnly: true,
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
                {({ field, form }: any) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Ex:250 Marks"
                    type="number"
                    onChange={(e: any) => {
                      const val = Number(e.target.value);
                      form.setFieldValue(field.name, val);
                      form.setFieldValue(
                        "total_marks",
                        val * formik.values.correct_marks,
                      );
                    }}
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
                  <TextField
                    {...field}
                    fullWidth
                    placeholder="Ex:250 Marks"
                    disabled
                  />
                )}
              </Field>
            </Grid>
          </Grid>
        </Grid>

        <Grid className="button-container">
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={() => formik.handleSubmit()}>
            Next: Add Questions
          </Button>
        </Grid>
      </FormikProvider>
    </Grid>
  );
}

export default CreateTestLanding;
