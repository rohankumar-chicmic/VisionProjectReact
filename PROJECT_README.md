# VisionPME Admin Panel - Developer Guide

Welcome to the VisionPME Admin Panel. This project is a high-fidelity React-based administrative interface built with TypeScript, Redux, and SCSS. This guide provides a technical overview for developers looking to understand, maintain, or extend the project.

---

## 🛠 Project Architecture

The codebase follows a modular architecture designed for high-fidelity UI management and scalable state handling.

### Directory Structure

```text
src/
├── assets/             # Images, fonts, and static assets
├── Components/         
│   ├── Atom/           # Reusable UI primitives (Buttons, Modals, Tables)
│   ├── Layouts/        # High-level layouts (AdminLayout, Sidebar, Header)
│   └── Shared/         # Common display components (KpiCards, etc.)
├── Routes/             # Routing configuration and Route Guards
├── Services/           # API services and business logic
├── Shared/             
│   ├── Context/        # React Contexts (e.g., HeaderContext)
│   └── Constants.ts    # Global constants
├── Store/              # Redux Toolkit configuration and slices
├── Styles/             # Global SCSS variables and mixins
└── Views/              # Main page components (Gala, Grants, Users, etc.)
```

## 🧩 Implemented Modules

This project contains several high-fidelity modules tailored for managing the VisionPME platform:

1. **User Management (`/users`)**: Supports complex user profiles, importing users, and creating new participants via modals.
2. **Galas & Grants (`/galas`, `/grants`)**: Features multi-step forms with advanced UI elements like the Custom Jury Criteria builder.
3. **Application Review (`/applications`)**: 
   - Uses a two-column layout for comprehensive application analysis.
   - Includes custom components for Rejecting applications (Reason selection) and Rescheduling interviews (Calendar picker).
   - Grants access to a dedicated **Jury Panel (`/applications/:id/jury`)** to view per-juror criteria ratings and suggested classes.
4. **Announcements (`/announcements`)**: A two-column interface for creating and managing system notifications with scheduling toggles.
5. **Admin Managers (`/admins`)**: Displays platform KPIs alongside a robust admin table, allowing Super Admins to create new roles with nuanced permissions via the `CreateAdminModal`.

---



## 🚀 Key Architectural Patterns

### 1. Dynamic Header System (Portals)
The application uses a **Dynamic Header System** that allows individual Views to control the content of the global Header (Title, Subtitle, and Buttons) without passing props through the router.

- **`HeaderContext`**: Holds the state of the header. Used via the `useHeader()` hook.
- **`HeaderActions` Component**: A portal component that teleports its children into the "Actions" slot of the global Header.

**Example Usage in a View:**
```tsx
const MyView = () => {
  const { setTitle, setSubtitle, setBackAction, resetHeader } = useHeader();

  useEffect(() => {
    setTitle('My New Page');
    setSubtitle('Secondary info here');
    setBackAction(true, () => navigate('/back'));
    return () => resetHeader(); // Always reset on unmount
  }, []);

  return (
    <div>
      <HeaderActions>
        <button className="btn-primary">Action Button</button>
      </HeaderActions>
      {/* Page Content */}
    </div>
  );
}
```

### 2. Standardized Routing
Routes are split into `PUBLIC_ROUTES` and `PRIVATE_ROUTES`.
- Register new authenticated pages in `src/Routes/PrivateRoutes.tsx`.
- Use the `title` property in the route object to automatically update the document title.

---

## 🎨 Styling & Design System

The project prioritizes a **Premium UI/UX**. 
- **Global Variables**: Defined in `src/index.css` (e.g., `--primary-color: #00ce86;`).
- **SCSS**: Each view has a corresponding SCSS file. Follow BEM-inspired naming or local nesting within the page class.
- **Icons**: Use the `lucide-react` library for all icons.

---

## 📝 How to Add a New Functional Page

If you want to add a new section (e.g., "Event Analytics"):

1.  **Create the View**:
    - Create `src/Views/Analytics/Analytics.tsx` and `Analytics.scss`.
    - Use `useHeader` to set the page identity.
2.  **Register the Route**:
    - Add the new path to `PRIVATE_ROUTES` in `src/Routes/PrivateRoutes.tsx`.
3.  **Update Sidebar**:
    - Add the new link to the `menuItems` array in `src/Components/Layouts/Sidebar.tsx`.
4.  **Connect State (Optional)**:
    - If needed, create a new Redux slice in `src/Store/Slices` and add it to the root reducer.

---

## 📦 Deployment & Environment

- **Running Locally**: `npm run dev`
- **Build**: `npm run build`
- **Linting**: `npm run lint` (Ensure all TypeScript and ESLint errors are resolved before pushing).

---

## ⚠️ Important Guidelines

- **No Hardcoded Links**: Always use `useNavigate()` or `NavLink` from `react-router-dom`.
- **Type Safety**: Avoid using `any`. Define interfaces for all state objects and component props.
- **Cleanup**: Always call `resetHeader()` in the `useEffect` cleanup function of your views to prevent header state "bleeding" between navigations.
