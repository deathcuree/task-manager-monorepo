import { Pagination as MuiPagination, Box } from '@mui/material';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color="primary"
      />
    </Box>
  );
};

export default Pagination;