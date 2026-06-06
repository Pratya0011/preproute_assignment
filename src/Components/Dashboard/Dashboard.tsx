import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "../../_api/_api";
import "./Dashboard.scss";
import { ITest } from "./helper";

const statusConfig: Record<
  string,
  { label: string; color: "success" | "warning" | "error" | "default" }
> = {
  live: { label: "Live", color: "success" },
  draft: { label: "Draft", color: "warning" },
  scheduled: { label: "Scheduled", color: "default" },
  expired: { label: "Expired", color: "error" },
};

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    width: 120,
    renderCell: (params) => {
      const config = statusConfig[params.value] ?? {
        label: params.value,
        color: "default",
      };
      return (
        <Chip
          label={config.label}
          color={config.color}
          size="small"
          className="status-chip"
        />
      );
    },
  },
  {
    field: "created_at",
    headerName: "Created Date",
    flex: 0.5,
    width: 150,
    renderCell: (params) => dayjs(params.value).format("DD MMM YYYY"),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 0.5,
    width: 130,
    sortable: false,
    filterable: false,
    renderCell: (_params) => (
      <Grid className="action-cell">
        <IconButton size="small" className="action-btn action-btn--view">
          <VisibilityOutlined fontSize="small" />
        </IconButton>
        <IconButton size="small" className="action-btn action-btn--edit">
          <EditOutlined fontSize="small" />
        </IconButton>
        <IconButton size="small" className="action-btn action-btn--delete">
          <DeleteOutlined fontSize="small" />
        </IconButton>
      </Grid>
    ),
  },
];

function Dashboard() {
  const [testList, setTestList] = useState<ITest[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const getAllTests = useCallback(async () => {
    const { status, body } = await getApi(`/tests`);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar(body.message, { variant: "error" });
      return;
    }
    if (status === 200) {
      setTestList(body?.data);
    }
  }, []);

  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  return (
    <Grid className="dashboard-container">
      <Grid className="dashboard-header">
        <Typography className="dashboard-title">Dashboard</Typography>
        <Button variant="contained">Create New Test</Button>
      </Grid>

      <Grid className="dashboard-filter-row">
        <TextField
          className="dashboard-search"
          placeholder="Search tests..."
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined className="search-icon" />
                </InputAdornment>
              ),
            },
          }}
        />

        <ToggleButtonGroup
          color="primary"
          exclusive
          aria-label="test-status-filter"
          className="filter-toggle-group"
        >
          <ToggleButton
            value="published"
            className="filter-toggle-btn filter-toggle-btn--left"
            sx={{
              padding: "0px 23px",
              // padding: payload.contest_status === 1 ? "0px 31px" : "0px 23px",
              // backgroundColor: payload.contest_status === 1 ? "#e8def8" : "transparent",
            }}
          >
            Published
          </ToggleButton>
          <ToggleButton
            value="draft"
            className="filter-toggle-btn filter-toggle-btn--right"
            sx={{
              padding: "0px 23px",
              // padding: payload.contest_status === 2 ? "0px 31px" : "0px 23px",
              // backgroundColor: payload.contest_status === 2 ? "#e8def8" : "transparent",
            }}
          >
            Active
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid className="dashboard-table">
        <DataGrid
          rows={testList}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          getRowId={(row) => row.id}
          className="test-data-grid"
        />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
