# Code Review

## Backend

### Bugs

**1. Invalid data may be returned as an empty array**

File: `jsonStore.js`

- **What is wrong:** If the JSON file contains valid JSON but the value is not an array, `readJsonArray()` returns an empty array instead of reporting a problem.
- **Why it matters:** The application may look like it has no records even though the stored data is incorrect.
- **How to improve:** Check that the parsed value is an array. If it is not, return a clear error instead of hiding the problem.

**2. Concurrent updates can cause data loss**

File: `jsonStore.js`

- **What is wrong:** Reading a JSON file, changing its contents, and writing it back is not protected against two requests running at the same time.
- **Why it matters:** One request can overwrite changes made by another request.
- **How to improve:** Serialize read-and-write operations for each file, or use a database if the application needs to handle more concurrent requests.

**3. The activity service can fail if the data folder does not exist**

File: `activity.service.js`

- **What is wrong:** The service creates `activity.json` if the file is missing, but it does not create the `data` folder first.
- **Why it matters:** File creation will fail if the parent folder does not exist.
- **How to improve:** Make sure the folder exists before creating the file, or use the shared JSON storage utility.

**4. Invalid activity JSON can crash a request**

File: `activity.service.js`

- **What is wrong:** `loadDataA()` and `loadDataB()` call `JSON.parse()` without handling invalid JSON.
- **Why it matters:** If the file is damaged or contains invalid JSON, the request can fail.
- **How to improve:** Use a shared JSON helper with clear error handling.

**5. Task title validation is not consistent**

Files: `tasks.controller.js`, `tasks.service.js`, task validation utilities

- **What is wrong:** The controller checks that the title is a string and not empty, while the service rejects titles shorter than two characters during updates. The separate validation functions are also not used by the controller shown here.
- **Why it matters:** Different parts of the API can apply different validation rules.
- **How to improve:** Call `validateCreateTask()` and `validateUpdateTask()` from the controller and keep the rules consistent.

**6. An update can accept a title containing only spaces**

File: `tasks.controller.js`

- **What is wrong:** `patchTask()` trims a string title but does not reject it if it becomes empty.
- **Why it matters:** A task can end up with an empty title.
- **How to improve:** After trimming, reject the title if it is empty.

**7. The task service can accept unexpected update fields if validation is bypassed**

File: `tasks.service.js`

- **What is wrong:** `updateTask()` spreads all properties from `updates` into the existing task.
- **Why it matters:** If the service is called without the expected validation, extra properties could be saved.
- **How to improve:** Validate the update payload and allow only `title` and `completed`.

**8. Error status codes need stricter validation**

Files: `HttpError`, `middleware/errorHandler.js`

- **What is wrong:** The error class accepts a status code without checking that it is a valid HTTP error status, and the error handler only checks whether the value is an integer.
- **Why it matters:** An invalid status code could lead to an incorrect response.
- **How to improve:** Validate status codes in `HttpError` and use a safe `500` response for unexpected errors.

### Performance

**1. The whole JSON file is read and written for each operation**

File: `jsonStore.js`

- **What is wrong:** The helper reads the complete file and rewrites the complete array for each change.
- **Why it matters:** This can become slow and use more memory as the data grows.
- **How to improve:** This is acceptable for a small project, but use a database if the amount of data or number of updates increases.

**2. The activity service uses synchronous file operations**

File: `activity.service.js`

- **What is wrong:** It uses `readFileSync()` and `writeFileSync()`.
- **Why it matters:** Synchronous file operations block the Node.js event loop while they run.
- **How to improve:** Use asynchronous file operations, such as the shared JSON storage helpers used by the task service.

### Security

**1. Activity request data is not validated**

Files: `activity.controller.js`, `activity.service.js`

- **What is wrong:** `addActivity()` passes the request body to the service without checking `action`, `info`, or unexpected fields.
- **Why it matters:** Invalid or unexpected values can be stored in the activity file.
- **How to improve:** Validate the body, check the expected field types, and reject unsupported fields.

**2. Task request validation is not fully connected**

File: `tasks.controller.js`

- **What is wrong:** The project has `validateCreateTask()` and `validateUpdateTask()`, but the controller shown does not use them.
- **Why it matters:** The controller can accept unsupported fields and does not consistently apply the validation rules already written.
- **How to improve:** Use the validation functions before calling the task service.

**3. Error details could expose internal information**

Files: `HttpError`, `middleware/errorHandler.js`

- **What is wrong:** `HttpError` can store extra details, and the error handler may send those details to the client.
- **Why it matters:** If the details contain internal or sensitive information, API clients could see it.
- **How to improve:** Return only safe details to clients and keep internal debugging information in server logs.

### Maintainability

**1. The activity service has duplicate loading functions**

File: `activity.service.js`

- **What is wrong:** `loadDataA()` and `loadDataB()` contain the same logic.
- **Why it matters:** Fixes may need to be repeated in more than one place.
- **How to improve:** Replace them with one shared loading function.

**2. The activity and task services handle JSON files differently**

Files: `activity.service.js`, `tasks.service.js`

- **What is wrong:** The activity service handles file operations directly, while the task service uses shared JSON utilities.
- **Why it matters:** Different approaches make the project harder to understand and maintain.
- **How to improve:** Use the shared JSON storage utilities in both services.

**3. Reading a file also creates it when it is missing**

File: `jsonStore.js`

- **What is wrong:** `readJsonArray()` creates a missing file with an empty array.
- **Why it matters:** A function that sounds like it only reads data also changes the file system.
- **How to improve:** Separate file initialization from reading, or document this behavior clearly if it is intentional.

**4. Validation is spread across multiple places**

Files: `tasks.controller.js`, `tasks.service.js`, task validation utilities

- **What is wrong:** Some validation is in the controller, some is in the service, and some is in the validation utility.
- **Why it matters:** The rules can become inconsistent when the code changes.
- **How to improve:** Keep request validation in the validation utility and keep the service focused on task operations and business rules.

### Code quality

**1. Activity IDs may not always be unique**

File: `activity.service.js`

- **What is wrong:** Activity IDs are created with `String(Date.now())`.
- **Why it matters:** Two activities created during the same millisecond could get the same ID.
- **How to improve:** Use the shared `createId()` utility, as the task service does.

**2. The JSON write helper should check its input**

File: `jsonStore.js`

- **What is wrong:** `writeJsonArray()` accepts any value, even though it is meant to write arrays.
- **Why it matters:** Unexpected data could be saved in a format that the read helper does not expect.
- **How to improve:** Check that the input is an array before writing it.

**3. Activity and task endpoints return different response formats**

Files: activity and task controllers

- **What is wrong:** Activity endpoints return the data directly, while task endpoints wrap it in a `data` property.
- **Why it matters:** The frontend has to handle different response shapes.
- **How to improve:** Use one response format consistently across the API.

**4. Async error handling is not consistent across routes**

Files: activity and task routers

- **What is wrong:** Task routes use `asyncHandler`, while activity routes call their controllers directly.
- **Why it matters:** Errors may be handled differently between modules.
- **How to improve:** Use the same error-handling pattern across routes, especially for asynchronous controller functions.

## Frontend

*These findings are based on the frontend review notes provided. The frontend source code was not included in the latest code snippet, so I have kept these findings limited to those notes.*

### Bugs

**1. Only one task update ID is tracked at a time**

- **What is wrong:** `updatingTaskId` stores only one task ID. If updates for two tasks overlap, the second request replaces the first ID, and the first request can clear the loading indicator while the second request is still running.
- **Why it matters:** The UI can show the wrong loading state or allow repeated actions.
- **How to improve:** Track pending updates for each task, for example with a `Set` of task IDs.

**2. Error handling in `requestJson` can catch its own error**

- **What is wrong:** The `try/catch` handles both JSON parsing and the error intentionally thrown after an unsuccessful response.
- **Why it matters:** The original API error can be handled in a confusing way, especially if the response body is invalid.
- **How to improve:** Separate response parsing from HTTP error creation and preserve the useful API error message.

**3. Activity filtering is applied more than once**

- **What is wrong:** `applyFilterA` and `applyFilterB` perform essentially the same filtering operation and are applied one after the other.
- **Why it matters:** This repeats work and makes the filtering logic harder to maintain.
- **How to improve:** Keep one filtering function and apply it once.

### Performance

**1. `useMemo` may not be needed for a small task list**

- **What is wrong:** The task filter uses `useMemo` to filter tasks when the tasks or filter change.
- **Why it matters:** For a small list, memoization may add complexity without a noticeable improvement.
- **How to improve:** Keep it if it helps in practice; otherwise, use a simple filter expression. Measure performance before adding more optimization.

**2. An interval causes repeated renders**

- **What is wrong:** The component updates `tick` every 1.4 seconds, even when the activity data has not changed.
- **Why it matters:** This causes unnecessary renders.
- **How to improve:** Remove the interval if regular refreshes are not needed. If they are needed, refresh only the data that can change.

### Security

**1. API response data is not checked at runtime**

- **What is wrong:** The request helper uses a TypeScript type assertion (`as T`) without checking the actual response structure.
- **Why it matters:** TypeScript cannot guarantee that data received from the server has the expected shape.
- **How to improve:** Validate API responses at runtime, for example with Zod, before using them.

### Maintainability

**1. Time formatting functions are duplicated**

- **What is wrong:** `formatTimeA` and `formatTimeB` contain the same logic.
- **Why it matters:** If the format needs to change, both functions may need updating.
- **How to improve:** Create one reusable time-formatting function.

**2. Derived activity lists are stored separately**

- **What is wrong:** `shownActivity` and `forcedList` are derived from other state values but are stored and updated separately.
- **Why it matters:** It creates more state to keep in sync and makes the code harder to follow.
- **How to improve:** Keep `allActivity` as the source of truth and derive the filtered list from it and `query`.

### Code quality

**1. An effect is used to calculate derived activity data**

- **What is wrong:** A `useEffect` updates `shownActivity` when `query`, `allActivity`, or `tick` changes, although filtering can be calculated during rendering.
- **Why it matters:** This can cause extra state updates and renders.
- **How to improve:** Calculate the filtered list directly from the existing state. Use `useMemo` only if the calculation needs it.

**2. API requests and server state are managed manually**

- **What is wrong:** The `requestJson` helper handles HTTP requests, while the `useTasks` hook manually manages data, loading, errors, and updates.
- **Why it matters:** As the application grows, it can become harder to handle caching, retries, and synchronization consistently.
- **How to improve:** Keep a reusable API client. Consider a library such as TanStack Query if the app needs more advanced server-state management.

### UX Issues

**1. Activity dates can be repeated**

- **What is wrong:** The activity feed may show the same timestamp more than once.
- **Why it matters:** Repeated information makes the feed harder to scan.
- **How to improve:** Show the date and time once, using a consistent and readable format.

**2. Fetching and update errors share one error state**

- **What is wrong:** The same error state is used for loading tasks and updating task status.
- **Why it matters:** An update error may appear in the wrong place, or one operation may clear another operation's error.
- **How to improve:** Use separate error states for loading and updating, or show update errors next to the task they belong to.

**3. Loading errors can look like an empty activity feed**

- **What is wrong:** When fetching activity fails, the code resets the activity arrays to empty without showing a clear error.
- **Why it matters:** Users may think there is no activity instead of realizing that loading failed.
- **How to improve:** Show an error message and provide a retry option.

### React Best Practices

**1. Avoid effects for derived state**

- **What is wrong:** Effects are used to keep `shownActivity` and `forcedList` synchronized with other state.
- **Why it matters:** This adds extra state updates and can make the UI harder to keep consistent.
- **How to improve:** Derive the filtered activity list from `allActivity` and `query` during rendering.

**2. Consider a server-state library if the app grows**

- **What is wrong:** The `useTasks` hook manages requests, loading state, errors, and server data manually.
- **Why it matters:** More features can make this logic difficult to maintain.
- **How to improve:** Consider TanStack Query for caching, refetching, and mutation states if the application needs them. Keep local UI state, such as the selected filter, in React state.

**3. Keep HTTP handling reusable**

- **What is wrong:** Basic request handling is in `requestJson`, while request lifecycle and server-state handling are managed separately in the hook.
- **Why it matters:** Similar request logic can become duplicated as more API features are added.
- **How to improve:** Keep shared HTTP handling in one API client and use a server-state library only if its features are useful for the project.
