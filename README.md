# Genetec React Developer Task

This repository contains a React + TypeScript application built with Vite as a submission for the Genetec React Developer technical task.

The goal of the project is to demonstrate the implementation of three reusable UI components and showcase them within a small demo application.

## Planned Components

### DataGrid

A reusable data grid component supporting:

- Client-side pagination
- Sorting
- Column filtering
- Loading, empty, and error states
- Configurable columns
  - Visibility
  - Labels
  - Accessors

### Timeline

A reusable timeline component supporting:

- Event grouping
- Keyboard navigation
- Screen-reader friendly announcements
- Accessible focus management

### Event Form

A reusable form component supporting:

- Controlled inputs
- Validation
- Error messages
- Focus management for invalid fields
- Create / edit workflows

## Technology Stack

- React
- TypeScript
- Vite
- ESLint

Additional libraries may be introduced during implementation when they provide clear value without hiding the core logic of the task.

## Project Structure

```text
src/
├── components/
│   ├── DataGrid/
│   ├── Timeline/
│   └── EventForm/
├── data/
├── hooks/
├── pages/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

## Development Approach

The application will use mock data only and focus on:

- Reusable component design
- Type safety
- Accessibility
- Maintainability
- Clear separation of concerns

The final application will include:

- A DataGrid displaying a mock dataset
- A Timeline rendering grouped events
- A New Event workflow that updates both views
- A small demo experience showcasing the reusable components
