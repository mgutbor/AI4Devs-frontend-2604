# Prompt Engineering Report

## Initial prompt

```markdown
You are a Senior Frontend Engineer.

Before writing any code, inspect the entire repository.

Do not make assumptions.

Analyze the project and explain:

- Which frontend framework is being used.
- Folder structure.
- Routing system.
- State management.
- API layer.
- Styling solution.
- Existing reusable UI components.
- Existing custom hooks.
- Existing utilities.
- Existing design system.
- Existing drag-and-drop libraries (if any).

Also identify where the following feature should be implemented:

- Position detail page
- Candidate Kanban
- API integration
- Navigation from Positions page

Do not generate code yet.

Only explain the current architecture and propose where each new file should live.
```

---

## Second prompt

```markdown
Based on your analysis of the repository, design the implementation of the Position page.

The page must:

- Show the position title.
- Include a back button.
- Display interview stages as Kanban columns.
- Display candidates inside the correct column.
- Allow moving candidates between columns.
- Update the backend after moving a candidate.
- Be responsive.

Describe:

- Components to create.
- Hooks to create.
- Services to create.
- Types/interfaces.
- State management.
- Folder structure.

Do not generate code yet.

Provide an implementation plan following best frontend practices.
```

---

## Third prompt

```markdown
Implement only the routing required for the new Position page.

Requirements:

- Reuse the existing routing solution.
- Follow the project's conventions.
- Do not modify unrelated routes.
- Add navigation from the existing "View Process" button.
- Use dynamic route parameters for the position id.

Show only the files that must be modified.

Explain every change.
```

---

## Fourth prompt

```markdown
Implement the API layer for the Position page.

Reuse the project's existing API utilities.

Create the necessary services for:

GET /positions/:id/interviewFlow

GET /positions/:id/candidates

PUT /candidates/:id/stage

Follow the project's existing conventions.

Include:

- TypeScript interfaces (if applicable)
- Error handling
- Async functions
- Proper typing

Do not implement UI yet.
```

---

## Fifth prompt

```markdown
Implement the Position page layout.

Requirements:

- Show the page title using the position name.
- Display a back arrow.
- Load interview stages.
- Render one empty column for each interview stage.
- Show loading state.
- Show error state.
- Show empty state.

Reuse existing UI components whenever possible.

Do not implement drag and drop yet.
```

---

## Sixth prompt

```markdown
Extend the Position page.

Load the candidates.

Render candidate cards inside the correct interview stage.

Each card must display:

- Full name
- Average score

Keep the code modular.

If useful, extract reusable components.

Do not implement drag and drop yet.
```

---

## Seventh prompt

```markdown
Implement drag and drop for the Kanban board.

Requirements:

- Reuse an existing drag-and-drop library if already installed.
- Otherwise recommend the smallest compatible library.
- Candidates must be draggable.
- Columns must accept drops.
- Local state must update immediately after dropping.
- Preserve code readability.

Do not connect the backend yet.
```

---

## Eight prompt

```markdown
Connect the drag-and-drop functionality with the backend.

When a candidate is dropped:

- Detect the destination interview stage.
- Find its interviewStepId.
- Call:

PUT /candidates/:id/stage

Body:

{
    "applicationId": "...",
    "currentInterviewStep": "stepId"
}

Requirements:

- Optimistic update if appropriate.
- Roll back UI if request fails.
- Display an error message if the update cannot be completed.

Reuse existing notification utilities if available.
```

---

## Ninth prompt

```markdown
Improve the Position page responsiveness.

Desktop:

- Horizontal Kanban
- Scroll horizontally if needed

Tablet:

- Responsive columns

Mobile:

- Vertical layout
- Full-width columns
- Comfortable spacing
- Good touch interaction

Reuse the project's styling conventions.

Do not change the desktop design unnecessarily.
```

---

## Tenth prompt

```markdown
Act as a Senior Frontend Reviewer.

Review every file modified for this feature.

Check:

- SOLID principles
- Readability
- Naming
- Reusability
- Performance
- Accessibility
- Error handling
- Loading states
- Empty states
- Responsive behavior
- Type safety
- Potential bugs
- Code duplication

List improvements ordered by priority.

Do not rewrite the entire implementation unless necessary.
```

---

## Eleventh prompt

```markdown
Refactor the implementation without changing its behavior.

Goals:

- Reduce duplicated code.
- Improve component composition.
- Improve maintainability.
- Simplify state management.
- Improve naming.
- Remove dead code.
- Keep compatibility with the current project.

Explain every refactoring.
```

---

## Twelfth prompt

```markdown
You are acting as a Senior Frontend Engineer and Pull Request Reviewer.

Perform a comprehensive review of the implemented Position page before it is merged into the main branch.

Review both the implementation and the overall user experience.

## Functional Validation

Verify that:

- Navigation from the Positions page works correctly.
- The back button returns to the Positions list.
- The position title is loaded correctly.
- Interview stages are loaded from the API.
- All interview stages are displayed in the correct order.
- Candidates are displayed in their corresponding interview stage.
- Each candidate card shows:
  - Full name
  - Average score
- Drag-and-drop works correctly.
- Moving a candidate updates the local UI.
- The PUT endpoint is called with the correct payload.
- Errors from the API are handled gracefully.
- Loading states are implemented.
- Empty states are implemented.
- The page behaves correctly when there are many candidates or many interview stages.

## UI / UX Review

Evaluate:

- Visual consistency with the rest of the application.
- Layout alignment and spacing.
- Typography consistency.
- Component hierarchy.
- Responsive behavior.
- Mobile usability.
- Accessibility basics (keyboard navigation, focus management, semantic HTML, ARIA where appropriate).

## Evergreen Browser Compatibility

Review the implementation for compatibility with:

- Google Chrome (latest stable)
- Microsoft Edge (latest stable)
- Mozilla Firefox (latest stable)
- Safari (latest stable)

Identify any potential issues related to:

- HTML semantics
- CSS compatibility
- Flexbox/Grid behavior
- Responsive layouts
- Drag-and-drop implementation
- Touch interactions
- Overflow and scrolling
- Pointer events
- Browser-specific APIs
- Modern JavaScript features
- Required polyfills (if any)

## Performance Review

Check for:

- Unnecessary re-renders.
- Large components that should be split.
- Unnecessary API calls.
- Expensive computations.
- Opportunities to memoize components.
- General maintainability.

## Code Quality

Review:

- Readability.
- Naming conventions.
- Folder organization.
- Component composition.
- Reusability.
- Type safety.
- Error handling.
- Dead code.
- Code duplication.
- Compliance with the project's existing architecture and conventions.

## Final Report

Produce a structured report including:

### ✅ Passed validations

List everything that is correctly implemented.

### ⚠ Issues found

For each issue include:

- Description
- Severity (Low / Medium / High)
- Browser(s) affected, if applicable
- Recommended solution

### 📋 Manual QA Checklist

Generate a checklist of manual tests that should be executed before merging the Pull Request.

### ⭐ Overall Assessment

Provide:

- Functional Quality Score (1–10)
- Code Quality Score (1–10)
- UI/UX Score (1–10)
- Browser Compatibility Score (1–10)
- Overall Production Readiness Score (1–10)

Finally, indicate whether you would:

- Approve the Pull Request
- Request Changes
- Reject the Pull Request

Justify your decision as a Senior Frontend Reviewer.
```

---

## Thirteenth prompt

```markdown
Remove the hardcoded mockPositions from the frontend and replace them with data loaded from the backend.

Implement a new GET /position endpoint in the existing backend architecture (service, controller, route) that returns the available positions.

Reuse the existing Prisma models and project conventions.

Do not modify the existing endpoints. Keep the implementation minimal, clean and fully integrated with the current codebase.
```

---

## Fourteenth prompt

```markdown
Generate Playwright end-to-end tests for the Position page.

Cover navigation from the Positions page, loading interview stages, rendering candidates, drag-and-drop between stages, API update after moving a candidate, back navigation, responsive layout, and basic accessibility checks.

Reuse the existing project structure and testing setup.
```