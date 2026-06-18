# Approach and Design Decisions

### Library Choices

To focus more on the task itself rather than rebuilding common UI patterns, I chose to use Radix UI Dialog and Dropdown Menu components. The main reasons were accessibility, reliable keyboard interactions, and the fact that these components already solve many common UI problems. This allowed me to spend more time on the application architecture and component design.

For form handling and validation, I chose React Hook Form and Zod. This combination provides simple form state management, validation on value changes, validation messages, and automatic focus management for invalid fields, which was one of the requirements of the task.

I also used Radix Icons to keep the UI visually consistent without introducing additional styling complexity.

### Mock Data Generation

Events are generated through a utility function that accepts the desired number of events and creates a corresponding dataset for the application.

The number of generated events can be adjusted by changing the value passed to the generator function inside:

```txt
src/pages/EventDashboard/EventDashboard.tsx
```

The generator itself is located at:

```txt
src/utils/mockDataGenerator.ts
```

Dates are generated within a range spanning several days in the past and a few weeks into the future. This ensures that the application always contains meaningful data for both the DataGrid and Timeline views, regardless of when the application is being tested.

### General Approach

During implementation, I tried to keep components as independent from the specific domain as possible. The DataGrid and Timeline components do not have direct knowledge of the Event model and instead receive configuration describing what and how they should render.

Components are split into smaller logical units to keep responsibilities clear and make the code easier to maintain and extend. The goal was for each component to solve a single problem and avoid taking on responsibilities that belong elsewhere.

### State Management

I decided to keep all application state local to the EventDashboard component. It acts as the central orchestration layer, owning the event collection, handling creation, updates, deletion, and managing simulated loading and error states.

I intentionally avoided introducing an additional state management library because the amount of shared state is relatively small and there is a single, clear source of truth used by all three main features.

In a real-world application, this layer would likely be responsible for API communication, data transformation, and managing loading and error states before passing data further into the application.

### DataGrid

The DataGrid was designed as a reusable component that has no knowledge of the data type it is rendering. Instead, it receives information about columns, accessors, filters, and sorting options through configuration.

This allows the table to remain independent from the Event domain and makes it reusable for other data types by providing a different configuration.

Alongside the table itself, there is a dedicated control panel responsible for filtering, searching, page size selection, and column visibility. Some columns can be hidden by the user, while others are intentionally kept visible because they represent essential information.

### Add/Edit Event Modal

The Add/Edit Event form was intentionally not designed as a completely generic component. Instead, it is focused on the Event domain and is reused for both creating and editing events.

Using a single form for both workflows keeps validation rules, layout, and data handling centralized in one place. I felt that introducing a generic form framework would add unnecessary complexity without providing significant value for this particular use case.

### Timeline

I chose to group events by day because it felt like the most natural way to represent information in a dashboard-oriented application. It allows users to quickly understand past activity, current events, and upcoming work.

In addition to the default view, the Timeline supports weekly and monthly views as well as keyboard navigation.

Keyboard navigation follows the visual structure of the component. Left and right navigation moves between events within the same day group, while up and down navigation moves between day groups. I felt this approach was more intuitive because it mirrors the way information is presented on screen.

The Timeline was also implemented independently from the Event domain and relies on configuration and rendering callbacks to display content.

### Accessibility

Accessibility was considered throughout the implementation rather than being treated as a separate concern at the end.

The Timeline supports keyboard navigation, while the form provides validation feedback and automatically focuses the first invalid field after submission. ARIA attributes and status messages are used where appropriate to improve the experience for keyboard users and assistive technologies.
