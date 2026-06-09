import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { handleSidebarToggle } from "../../_store/reducer/commonStore";
import menu from "../../assets/menu.png";
import think from "../../assets/think.png";
import { useCreateTestContext } from "./createTestContext";
import Questions from "./Questions";
import "./createTest.scss";
import Publish from "./Publish";

const breadcrumbSx = {
  color: "#6B7180",
  fontSize: "0.875rem",
  textDecoration: "none",
  "&:hover": {
    color: "#6B7180",
    textDecoration: "underline",
  },
};

const difficultyConfig: Record<string, { bg: string; color: string }> = {
  easy: { bg: "#2AB7A9", color: "#fff" },
  medium: { bg: "#f59e0b", color: "#fff" },
  hard: { bg: "#ef4444", color: "#fff" },
};

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function AddQuestions() {
  const dispatch = useDispatch();
  const { testId } = useParams();
  const { contextState, setContextState }: any = useCreateTestContext();
  const testDetails = contextState?.testDetails;

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
  // const diffStyle =
  //   difficultyConfig[testDetails?.difficulty?.toLowerCase()] ??
  //   difficultyConfig.easy;
  const diffStyle = difficultyConfig.easy;

  useEffect(() => {
    dispatch(handleSidebarToggle(false));
  }, []);

  return (
    <Grid className="question-container">
      <Grid className="question-header">
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

      <Box className="question-body">
        <Grid className="side-section">
          <Box className="side-section-header">
            <Typography className="side-section-title">
              Question Creation
            </Typography>
            <IconButton size="small">
              <KeyboardDoubleArrowLeftIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography className="side-section-total">
            Total Questions . <span>{testDetails?.total_questions ?? 0}</span>
          </Typography>

          <Box className="question-list">
            {Array.from(
              { length: contextState?.formQuestionCount ?? 1 },
              (_, i) => {
                const saved = contextState?.questions?.[i];
                return (
                  <Box
                    key={i}
                    className={`question-list-item${saved ? " completed" : ""}`}
                    onClick={() =>
                      setContextState((prev: any) => ({
                        ...prev,
                        currentQuestionIndex: i,
                      }))
                    }
                  >
                    {saved ? (
                      <CheckCircleIcon
                        className="question-status-icon completed"
                        fontSize="small"
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        className="question-status-icon"
                        fontSize="small"
                      />
                    )}
                    <Typography className="question-list-label">
                      Question {i + 1}
                    </Typography>
                    <IconButton size="small" className="question-list-arrow">
                      <KeyboardDoubleArrowRightIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              },
            )}
          </Box>
        </Grid>

        <Box className="question-main">
          {testDetails && (
            <>
              <Paper
                className="test-details-card"
                elevation={0}
                variant="outlined"
              >
                <Box className="test-details-top">
                  <Chip
                    label="Chapter Wise"
                    className="test-type-chip"
                    size="small"
                  />
                  <IconButton
                    size="small"
                    className="test-edit-btn"
                    onClick={() => {
                      setContextState((prev: any) => ({
                        ...prev,
                        type: "createTest",
                        activeStep: 0,
                      }));
                      dispatch(handleSidebarToggle(true));
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box className="test-details-name-row">
                  <img src={menu} height="24px" width="24px" />
                  <Typography className="test-name">
                    {testDetails.name}
                  </Typography>
                  <Chip
                    icon={<img src={think} height="18px" width="18ox" />}
                    label={capitalize(testDetails.difficulty)}
                    size="small"
                    className="difficulty-chip"
                    sx={{
                      backgroundColor: diffStyle.bg,
                      color: diffStyle.color,
                    }}
                  />
                </Box>

                <Box className="test-details-meta">
                  <Box className="test-meta-row">
                    <Typography className="meta-label">Subject</Typography>
                    <Typography className="meta-colon">:</Typography>
                    <Typography className="meta-value">
                      {testDetails.subject}
                    </Typography>
                  </Box>

                  {testDetails.topics?.length > 0 && (
                    <Box className="test-meta-row">
                      <Typography className="meta-label">Topic</Typography>
                      <Typography className="meta-colon">:</Typography>
                      <Box className="meta-chips">
                        {testDetails.topics.map((topic: string) => (
                          <Chip
                            key={topic}
                            label={topic}
                            size="small"
                            className="topic-chip"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {testDetails.sub_topics?.length > 0 && (
                    <Box className="test-meta-row">
                      <Typography className="meta-label">Sub Topic</Typography>
                      <Typography className="meta-colon">:</Typography>
                      <Box className="meta-chips">
                        {testDetails.sub_topics.map((st: string) => (
                          <Chip
                            key={st}
                            label={st}
                            size="small"
                            className="topic-chip"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box className="test-details-stats">
                  <Box className="stat-item">
                    <AccessTimeIcon fontSize="small" className="stat-icon" />
                    <Typography className="stat-text">
                      {testDetails.total_time} Min
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box className="stat-item">
                    <ArticleOutlinedIcon
                      fontSize="small"
                      className="stat-icon"
                    />
                    <Typography className="stat-text">
                      {testDetails.total_questions} Q's
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box className="stat-item">
                    <BarChartIcon fontSize="small" className="stat-icon" />
                    <Typography className="stat-text">
                      {testDetails.total_marks} Marks
                    </Typography>
                  </Box>
                </Box>
              </Paper>
              {contextState.type === "addQuestion" && <Questions />}
            </>
          )}
        </Box>
      </Box>
    </Grid>
  );
}

export default AddQuestions;
