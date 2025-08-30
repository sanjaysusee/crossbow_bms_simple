import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Fade,
  Slide,
  Grow,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Dashboard,
  Assessment,
  TrendingUp,
  Thermostat,
  Power,
  Speed,
  Schedule,
  Refresh,
  FilterList,
  Download,
  Visibility,
  VisibilityOff,
  Close,
  BarChart,
  Timeline,
  ShowChart,
  PieChart,
  TableChart,
  ArrowBack,
  PowerSettingsNew,
  CloudDownload,
} from '@mui/icons-material';
import { VfdStatsData, VfdStatsRequest } from '../types/bms';
import { bmsApi } from '../services/bmsApi';

interface ReportsProps {
  onLogout: () => void;
  onNavigate?: (view: 'main' | 'reports') => void;
}

const drawerWidth = 280;

export const Reports: React.FC<ReportsProps> = ({ onLogout, onNavigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [vfdStats, setVfdStats] = useState<VfdStatsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: new Date().toISOString().split('T')[0], // Today
  });

  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Format date for API (YYYY-MM-DD HH:mm format)
  const formatDateForAPI = (dateString: string, isEndDate: boolean = false) => {
    const date = new Date(dateString);
    if (isEndDate) {
      date.setHours(23, 59, 59, 999); // End of day
    } else {
      date.setHours(0, 0, 0, 0); // Start of day
    }
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const fetchVfdStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      const request: VfdStatsRequest = {
        operationDoneBy: 'crossbow',
        requestType: 'ElectricalMeters',
        subRequestType: 'refreshStatsData',
        QueryNum: 8104,
        key: 'VFD_STATS_DATA',
        Parm1: 581,
        Parm2: 20,
        Parm3: formatDateForAPI(dateRange.startDate), // Start time: 00:00
        Parm4: formatDateForAPI(dateRange.endDate, true), // End time: 23:59
      };

      console.log('Fetching VFD stats with request:', request);
      const response = await bmsApi.getVfdStats(request);
      
      // Handle the actual API response structure
      if (response.data && response.data.rows) {
        setVfdStats(response.data.rows);
      } else {
        console.error('No rows found in response:', response);
        setVfdStats([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch VFD stats');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchVfdStats();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatValue = (value: any, field: string) => {
    if (value === null || value === undefined || value === '') return '-';
    
    // Handle special formatting for specific fields
    switch (field) {
      case 'vfdpolledtimestamp':
      case 'vfdlogtime':
        return new Date(value).toLocaleString();
      case 'vfdbtu':
      case 'currvfdbtu':
        return `${parseFloat(value).toFixed(2)} kWh`;
      case 'vfdfrequency':
      case 'vfdminfrequency':
      case 'vfdmaxfrequency':
        return `${parseFloat(value).toFixed(1)} Hz`;
      case 'vfdpower':
        return `${parseFloat(value).toFixed(2)} kW`;
      case 'vfdvoltage':
        return `${parseFloat(value).toFixed(1)} V`;
      case 'vfdcurrent':
        return `${parseFloat(value).toFixed(1)} A`;
      case 'vfdhumidity':
        return `${parseFloat(value).toFixed(1)}%`;
      case 'vfdco2level':
        return `${parseFloat(value).toFixed(0)} ppm`;
      case 'vfdaqi':
        return parseFloat(value).toFixed(0);
      case 'vfdwaterin':
      case 'vfdwaterout':
      case 'vfdsupplyair':
      case 'vfdreturnair':
        return `${parseFloat(value).toFixed(1)}°C`;
      case 'vfdwaterflow':
        return `${parseFloat(value).toFixed(0)} L/Hr`;
      case 'vfdwaterpressure':
        return `${parseFloat(value).toFixed(2)} Bar`;
      case 'vfdrunninghrs':
        return `${parseFloat(value).toFixed(1)} H`;
      default:
        return value;
    }
  };

  const getStatusColor = (value: any, field: string) => {
    if (value === null || value === undefined) return 'default';
    
    switch (field) {
      case 'vfdaqi':
        const aqi = parseFloat(value);
        if (aqi <= 50) return 'success';
        if (aqi <= 100) return 'warning';
        if (aqi <= 150) return 'error';
        return 'error';
      case 'vfdco2level':
        const co2 = parseFloat(value);
        if (co2 <= 400) return 'success';
        if (co2 <= 1000) return 'warning';
        return 'error';
      case 'vfdstatus':
        return value === 1 ? 'success' : 'error';
      case 'vfdfilterstatus':
        return value === 0 ? 'success' : 'error';
      case 'vfdfiresignal':
        return value === 0 ? 'success' : 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', pb: 12 }}> {/* Add bottom padding for footer */}
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={false}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
          }}
        >
          {/* Mobile sidebar content */}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              pb: 12, // Add bottom padding to prevent footer overlap
              zIndex: 999, // Ensure sidebar is below footer
            },
          }}
          open
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Reports Section
            </Typography>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={true}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  <Assessment />
                </ListItemIcon>
                <ListItemText
                  primary="VFD Statistics"
                  sx={{ color: 'white' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 280px)` },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* App Bar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: 1000,
            width: { md: `calc(100% - 280px)` },
            ml: { md: '280px' },
            bottom: 'auto', // Ensure AppBar doesn't interfere with footer
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="back to main"
              onClick={() => onNavigate?.('main')}
              edge="start"
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              VFD Statistics Report
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ pt: 10, pb: 16 }}> {/* Increased bottom padding for footer */}
          {/* Header Card */}
          <Card
            sx={{
              mb: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                VFD Statistics Report
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time Variable Frequency Drive performance and environmental data
              </Typography>
            </CardContent>
          </Card>

          {/* Controls Section */}
          <Card
            sx={{
              mb: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Timeline Parameters
                </Typography>
                <Chip 
                  label={`${dateRange.startDate} to ${dateRange.endDate}`} 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
              
              {/* Date Range Picker */}
              <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <Button
                  variant="contained"
                  startIcon={<CloudDownload />}
                  onClick={fetchVfdStats}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: 2,
                    minWidth: 150,
                  }}
                >
                  {loading ? <CircularProgress size={16} /> : 'Load Data'}
                </Button>
              </Box>

              {/* Action Buttons */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ borderRadius: 2 }}
                >
                  Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchVfdStats}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  {loading ? <CircularProgress size={16} /> : 'Refresh'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TableChart />}
                  onClick={() => {
                    // Load sample data for testing
                    const sampleData = [
                      {
                        vfdrecordid: 25553819,
                        vfdpolledtimestamp: "2025-08-30 17:29:32",
                        vfdbtu: 0,
                        currvfdbtu: 176853.11,
                        vfdmode: 0,
                        vfdstatus: 0,
                        vfdfrequency: 0,
                        vfdminfrequency: 40,
                        vfdmaxfrequency: 45,
                        vfdtpcontrol: 0,
                        vfdsettemp: 24,
                        vfdpidconstant: 1,
                        vfdschedulestatus: 1,
                        vfdscheduleontime: "11:00",
                        vfdscheduleofftime: "14:00",
                        vfdflowspan: "1-3",
                        vfdsetco2: 500,
                        vfdwateractuatordir: 1,
                        vfdlogtime: "2025-08-31 17:27:58",
                        vfdwaterin: 16.7,
                        vfdwaterout: 17.81,
                        vfdwaterflow: 0,
                        vfdreturnair: 29.84,
                        vfdpower: 0,
                        vfdhumidity: 27,
                        vfdco2level: 990,
                        vfdfilterstatus: 0,
                        vfdwatervalveposition: 0,
                        vfdfreshairvalve: 100,
                        vfdsupplyair: 29.3,
                        vfdwaterdeltatset: 5,
                        vfdmaxflowrateset: 2.5,
                        vfdtotalvav: 0,
                        vfdvoltage: 0,
                        vfdcurrent: 0,
                        vfdrunninghrs: 8714.28,
                        vfdfiresignal: 0,
                        vfdonoffsource: 8,
                        vfdflowmetertype: 1,
                        vfdtype: 0,
                        vfdinletthreshold: 9,
                        vfdaqi: 369,
                        vfdparticlematter1: 4,
                        vfdparticlematter2: 5,
                        vfdparticlematter3: 8,
                        vfdtvoc: 95,
                        vfdcorbonmonoxide: 3333,
                        vfdaqicomponent: 5,
                        vfdwaterpressure: 0
                      }
                    ];
                    setVfdStats(sampleData);
                    setError('');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  Load Sample Data
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: 2,
                  }}
                >
                  Export
                </Button>
              </Box>

              {/* Error Display */}
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Data Status */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Records loaded: {vfdStats.length}
            </Typography>
            {vfdStats.length === 0 && !loading && (
              <Typography variant="body2" color="text.secondary">
                No data available. Try adjusting the date range or click "Load Sample Data" to test.
              </Typography>
            )}
          </Box>

          {/* VFD Statistics Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress size={60} />
            </Box>
          ) : vfdStats.length > 0 ? (
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Temperature</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Power & BTU</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Humidity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Air Quality</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Water Data</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>System Info</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vfdStats
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={row.vfdrecordid || index} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {formatValue(row.vfdpolledtimestamp, 'vfdpolledtimestamp')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={row.vfdstatus === 1 ? 'ON' : 'OFF'}
                              color={getStatusColor(row.vfdstatus, 'vfdstatus')}
                              size="small"
                            />
                            <Chip
                              label={row.vfdmode === 0 ? 'Auto' : 'Manual'}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ ml: 0.5 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Set: {formatValue(row.vfdsettemp, 'vfdsettemp')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Supply: {formatValue(row.vfdsupplyair, 'vfdsupplyair')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Power: {formatValue(row.vfdpower, 'vfdpower')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              BTU: {formatValue(row.currvfdbtu, 'currvfdbtu')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Current: {formatValue(row.vfdfrequency, 'vfdfrequency')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Range: {formatValue(row.vfdminfrequency, 'vfdminfrequency')} - {formatValue(row.vfdmaxfrequency, 'vfdmaxfrequency')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatValue(row.vfdhumidity, 'vfdhumidity')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              AQI: <Chip label={formatValue(row.vfdaqi, 'vfdaqi')} color={getStatusColor(row.vfdaqi, 'vfdaqi')} size="small" />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              CO2: {formatValue(row.vfdco2level, 'vfdco2level')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              In: {formatValue(row.vfdwaterin, 'vfdwaterin')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Out: {formatValue(row.vfdwaterout, 'vfdwaterout')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Voltage: {formatValue(row.vfdvoltage, 'vfdvoltage')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Running: {formatValue(row.vfdrunninghrs, 'vfdrunninghrs')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={vfdStats.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          ) : (
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No VFD Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting the date range or click "Load Sample Data" to test the table display.
              </Typography>
            </Card>
          )}
        </Container>
      </Box>
    </Box>
  );
};
