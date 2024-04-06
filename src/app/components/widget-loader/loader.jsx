import * as React from 'react';
import {Box} from '@mui/material';
import { CircularProgress } from '@mui/material';

export default function Loader() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    </div>
  );
}
