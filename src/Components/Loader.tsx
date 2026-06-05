import { CircularProgress } from "@mui/material";

function Loader() {
  return (
    <div className="loading">
      <CircularProgress sx={{ color: "#5b7af5" }} />
    </div>
  );
}

export default Loader;
