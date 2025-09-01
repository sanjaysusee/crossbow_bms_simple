# BMS Simple Control

A simplified Building Management System (BMS) frontend application for temperature control.

## Features

- **Current Temperature Display**: Shows real-time temperature from the BMS system
- **AC On/Off Control**: Simple toggle to turn the AC system on or off
- **Schedule Control**: Enable/disable scheduling with customizable start and end times
- **Temperature Setting**: Adjust target temperature (23-28°C) with slider, increment/decrement buttons, or manual input
- **Real-time Status**: Online/offline status indicator with manual refresh capability
- **Clean Interface**: Simple, white background with essential controls only

## Prerequisites

- Node.js (>=16.0.0)
- Backend BMS API running on `http://localhost:4000`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:5000`

## Build for Production

```bash
npm run build
```

## API Endpoints Used

- `POST /api/login` - User authentication
- `POST /api/set-temp` - Set temperature and control AC
- `POST /api/get-current-status` - Get current BMS status
- `POST /api/set-schedule-status` - Control schedule status
- `POST /api/set-schedule-time` - Set schedule times

## Project Structure

```
src/
├── components/
│   ├── Login.tsx                    # Login component
│   └── SimpleTemperatureControl.tsx # Main control interface
├── services/
│   └── bmsApi.ts                   # API service functions
├── types/
│   └── bms.ts                      # TypeScript type definitions
└── App.tsx                         # Main application component
```

## Backend Requirements

This frontend requires the BMS backend API to be running. The backend should provide the following endpoints:

- Authentication endpoint
- Temperature control endpoints
- Status monitoring endpoints
- Schedule control endpoints

## Deployment

The application can be deployed to any static hosting service. The build folder contains the optimized production files.

## License

This project is part of the CrossbowSec BMS Control System.
