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
import { deleteApi, getApi } from "../../_api/_api";
import "./Dashboard.scss";
import { ITest } from "./helper";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [testList, setTestList] = useState<ITest[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [filteredList, setFilteredList] = useState<ITest[]>([]);
  const [debounceTimer, setDebounceTimer] = useState(0);
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
      setFilteredList(body?.data);
    }
  }, []);

  const deleteTest = useCallback(async (testId: string) => {
    const { status, body } = await deleteApi(`/tests/${testId}`);
    if (status >= 400 && status <= 599) {
      enqueueSnackbar(body.message, { variant: "error" });
      return;
    }
    enqueueSnackbar(body.message, { variant: "success" });
    getAllTests();
  }, []);

  const applyFilters = useCallback(
    (search: string, status: string | null) => {
      const query = search.trim().toLowerCase();
      setFilteredList(
        testList.filter((t) => {
          const matchesSearch = !query || t.name.toLowerCase().includes(query);
          const matchesStatus = !status || t.status === status;
          return matchesSearch && matchesStatus;
        }),
      );
    },
    [testList],
  );

  const filterProductsBySearch = useCallback(
    (search: string) => applyFilters(search, selectedStatus),
    [applyFilters, selectedStatus],
  );

  const handleFilterState = useCallback(
    (_e: React.MouseEvent<HTMLElement>, value: string | null) => {
      setSelectedStatus(value);
      applyFilters(searchString, value);
    },
    [applyFilters, searchString],
  );

  useEffect(() => {
    getAllTests();
  }, [getAllTests]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => filterProductsBySearch(searchString), 2000);
    setDebounceTimer(timer);
  }, [searchString]);

  // live, unpublished, scheduled, expired, draft

  const handleViewTest = (testId: string) => {
    navigate(`/test-edit/${testId}`, {
      state: { activeStep: 1, isView: true },
    });
  };

  const statusConfig: Record<
    string,
    {
      label: string;
      color: "success" | "warning" | "error" | "default" | "info";
    }
  > = {
    live: { label: "Live", color: "success" },
    draft: { label: "Draft", color: "warning" },
    scheduled: { label: "Scheduled", color: "info" },
    expired: { label: "Expired", color: "error" },
    unpublished: { label: "Unpublished", color: "default" },
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
          label: params.value || "NA",
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
          <IconButton
            size="small"
            className="action-btn action-btn--view"
            onClick={() => handleViewTest(_params.row.id)}
          >
            <VisibilityOutlined fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            className="action-btn action-btn--edit"
            onClick={() => navigate(`/test-edit/${_params.row.id}`)}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            className="action-btn action-btn--delete"
            onClick={() => deleteTest(_params.row.id)}
          >
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Grid>
      ),
    },
  ];

  return (
    <Grid className="dashboard-container">
      <Grid className="dashboard-header">
        <Typography className="dashboard-title">Dashboard</Typography>
        <Button variant="contained" onClick={() => navigate("/test-creation")}>
          Create New Test
        </Button>
      </Grid>

      <Grid className="dashboard-filter-row">
        <TextField
          className="dashboard-search"
          placeholder="Search tests..."
          variant="outlined"
          size="small"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
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
          value={selectedStatus}
          onChange={handleFilterState}
          aria-label="test-status-filter"
          className="filter-toggle-group"
        >
          <ToggleButton
            value="draft"
            className="filter-toggle-btn filter-toggle-btn--left"
            sx={{ padding: "0px 23px" }}
          >
            Draft
          </ToggleButton>
          <ToggleButton
            value="live"
            className="filter-toggle-btn filter-toggle-btn--right"
            sx={{ padding: "0px 23px" }}
          >
            Live
          </ToggleButton>
          <ToggleButton
            value="unpublished"
            className="filter-toggle-btn filter-toggle-btn--right"
            sx={{ padding: "0px 23px" }}
          >
            Unpublished
          </ToggleButton>
          <ToggleButton
            value="scheduled"
            className="filter-toggle-btn filter-toggle-btn--right"
            sx={{ padding: "0px 23px" }}
          >
            Scheduled
          </ToggleButton>
          <ToggleButton
            value="expired"
            className="filter-toggle-btn filter-toggle-btn--right"
            sx={{ padding: "0px 23px" }}
          >
            Expired
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid className="dashboard-table">
        <DataGrid
          rows={filteredList}
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
