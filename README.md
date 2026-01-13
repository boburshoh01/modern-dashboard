# Modern Dashboard - Nuxt 3

Zamonaviy admin panel - Frontend Developer Assessment uchun yaratilgan.

## Texnologiyalar

- **Nuxt 3** - Vue.js framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design Vue** - UI component library
- **Pinia** - State management
- **Axios** - HTTP client
- **API**: [DummyJSON](https://dummyjson.com/)

## O'rnatilgan Paketlar

### Dependencies

- `nuxt` - Nuxt 3 framework
- `vue` - Vue 3
- `ant-design-vue` - UI components
- `@ant-design/icons-vue` - Ant Design icons
- `@pinia/nuxt` - Pinia Nuxt module
- `pinia` - State management
- `pinia-plugin-persistedstate` - LocalStorage persist plugin
- `axios` - HTTP client

### Dev Dependencies

- `@nuxtjs/tailwindcss` - Tailwind CSS module
- `tailwindcss` - CSS framework
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `vue-tsc` - Vue TypeScript compiler

## Loyiha Strukturasi

```
moderndashboard/
├── assets/
│   └── css/
│       └── main.css          # Tailwind directives va global styles
├── composables/
│   ├── useApi.ts             # API client composable
│   ├── useNotification.ts    # Notification helper
│   ├── useValidation.ts      # Form validation composable
│   └── useAppConfirm.ts      # Confirmation modal helper
├── plugins/
│   ├── antd.ts               # Ant Design Vue plugin
│   └── pinia-persist.client.ts # Pinia persistence plugin
├── stores/
│   ├── auth.ts               # Authentication store (with persist)
│   ├── theme.ts              # Theme store (dark mode with persist)
│   ├── locale.ts             # Language store (with persist)
│   ├── dashboard.ts          # Dashboard statistics store
│   ├── products.ts           # Products store
│   └── users.ts              # Users store
├── types/
│   ├── index.ts              # Main type definitions
│   └── api.ts                # API type definitions
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## Ishga Tushirish

1. Dependencies o'rnatish:

```bash
pnpm install
```

2. Development server:

```bash
pnpm dev
```

3. Production build:

```bash
pnpm build
```

4. Preview production build:

```bash
pnpm preview
```

## Xususiyatlar

### 1. API Client (useApi)

```typescript
const { get, post, put, delete } = useApi()

// GET request
const users = await get('/users')

// POST request
const newUser = await post('/users/add', userData)
```

### 2. Notification System (useNotification)

```typescript
const { success, error, warning, info } = useNotification();

success("Muvaffaqiyatli!", "Ma'lumot saqlandi");
error("Xatolik!", "Nimadir xato ketdi");
```

### 3. Pinia Stores (with Persistence)

#### Auth Store

```typescript
const authStore = useAuthStore();

// Login
await authStore.login({ username, password });

// Logout
await authStore.logout();

// Get current user
const user = authStore.currentUser;

// Check loading/error state
const { loading, error } = authStore;
```

#### Theme Store

```typescript
const themeStore = useThemeStore();

// Toggle between light/dark/system
themeStore.toggleTheme();

// Set specific mode
themeStore.setMode("dark"); // 'light' | 'dark' | 'system'

// Initialize theme (call in app setup)
themeStore.initTheme();

// Get current state
const isDark = themeStore.isDarkMode;
```

#### Locale Store

```typescript
const localeStore = useLocaleStore();

// Set language
localeStore.setLocale("uz"); // 'en' | 'uz' | 'ru'

// Get current locale
const currentLang = localeStore.currentLocale;

// Get available locales
const locales = localeStore.availableLocales;
```

#### Products Store

```typescript
const productsStore = useProductsStore();

// Fetch products
await productsStore.fetchProducts({ limit: 10, skip: 0 });

// Search products
await productsStore.fetchProducts({ q: "phone" });

// Filter by category
await productsStore.fetchProducts({ category: "smartphones" });

// CRUD operations
await productsStore.addProduct(productData);
await productsStore.updateProduct(id, updates);
await productsStore.deleteProduct(id);

// Check state
const { products, loading, error } = productsStore;
```

#### Users Store

```typescript
const usersStore = useUsersStore();

// Fetch users
await usersStore.fetchUsers({ limit: 10, skip: 0 });

// Search users
await usersStore.fetchUsers({ search: "John" });

// CRUD operations
await usersStore.addUser(userData);
await usersStore.updateUser(id, updates);
await usersStore.deleteUser(id);
```

#### Dashboard Store

```typescript
const dashboardStore = useDashboardStore();

// Fetch dashboard statistics
await dashboardStore.fetchDashboardStats();

// Access stats
const { totalUsers, totalOrders, totalSales, totalPending } =
  dashboardStore.stats;

// Check loading state
const isLoading = dashboardStore.loading;

// Reset stats
dashboardStore.resetStats();
```

### 4. Form Validation (useValidation)

To'liq form validation tizimi - Ant Design Vue bilan integratsiya qilingan.

```typescript
const {
  required,
  email,
  phone,
  minLength,
  maxLength,
  password,
  username,
  loginRules,
  userFormRules,
  productFormRules,
} = useValidation();

// Using predefined rule sets
const rules = {
  username: loginRules.username,
  password: loginRules.password,
};

// Custom validation
const customRules = {
  firstName: [required("First Name"), minLength(2), maxLength(50)],
  email: [required("Email"), email()],
  phone: [phone()],
  username: [required("Username"), username()],
};

// Real-time validation
await validateField(formRef, "username");
await validateForm(formRef);
```

#### Available Validators:

- `required(field, message?)` - Required field
- `email(message?)` - Email format
- `phone(message?)` - Phone format (international)
- `minLength(length, message?)` - Minimum length
- `maxLength(length, message?)` - Maximum length
- `minValue(min, message?)` - Minimum number value
- `maxValue(max, message?)` - Maximum number value
- `range(min, max, message?)` - Number range
- `url(message?)` - URL validation
- `password(message?)` - Strong password (8+ chars, 1 uppercase, 1 lowercase, 1 number)
- `confirmPassword(field, message?)` - Password confirmation match
- `username(message?)` - Username format (3-20 chars, alphanumeric + underscore)
- `alphanumeric(message?)` - Only letters and numbers
- `numeric(message?)` - Only numbers
- `alpha(message?)` - Only letters
- `noWhitespace(message?)` - No whitespace allowed
- `pattern(regex, message)` - Custom regex pattern
- `custom(validator)` - Custom validator function

#### Predefined Rule Sets:

- `loginRules` - Username and password rules
- `registerRules` - Registration form rules
- `userFormRules` - User form validation
- `productFormRules` - Product form validation

All validation messages support i18n (EN, UZ, RU).

### 5. TypeScript Support

Barcha komponentlar va funksiyalar TypeScript bilan yozilgan va type-safe.

```typescript
import type { User, Product, ValidationRule } from "~/types";

const user: User = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  username: "johndoe",
};
```

## API Endpoints (DummyJSON)

- Users: `https://dummyjson.com/users`
- Products: `https://dummyjson.com/products`
- Posts: `https://dummyjson.com/posts`
- Auth: `https://dummyjson.com/auth/login`

## Bajarilgan Vazifalar

### State Management ✅

- [x] Centralized state management with Pinia
- [x] Auth store with loading/error states
- [x] Theme store (dark mode with persist)
- [x] Locale store (language management with persist)
- [x] Dashboard store with statistics
- [x] Products store with CRUD operations
- [x] Users store with CRUD operations
- [x] Pinia persistence plugin configured

### Form Validation ✅

- [x] Complete validation composable (useValidation)
- [x] Required fields validation
- [x] Email format validation
- [x] Phone format validation
- [x] Min/Max length validation
- [x] Number ranges validation
- [x] URL validation
- [x] Password strength validation
- [x] Custom validators support
- [x] Real-time validation helpers
- [x] Error messages with i18n (EN, UZ, RU)
- [x] Predefined rule sets for common forms

## Implemented Features

### Pages

- [x] Login page
- [x] Dashboard page (with API integration)
- [x] Products page (with CRUD)
- [x] Users page (with CRUD)
- [x] Favorites page
- [x] Product detail page
- [x] User detail page

### Components

- [x] AppBreadcrumbs - Navigation breadcrumbs
- [x] AppEmpty - Empty state component
- [x] AppLoading - Loading spinner
- [x] AppTable - Data table with pagination
- [x] LineChart - Chart.js integration
- [x] AppFormStyles - Form styling utilities

### Composables

- [x] useApi - HTTP client wrapper
- [x] useNotification - Notification system
- [x] useValidation - Form validation
- [x] useAppConfirm - Confirmation dialogs

### Middleware

- [x] auth.ts - Protected routes
- [x] guest.ts - Guest-only routes

### Localization

- [x] i18n setup (EN, UZ, RU)
- [x] Language switcher
- [x] Validation messages in all languages
- [x] UI translations

## Keyingi Qadamlar

1. Advanced filtering and sorting
2. Export functions (CSV, Excel, PDF)
3. User permissions and roles
4. Activity logs
5. Settings page
6. Profile page
7. Dashboard analytics

## Resurslar

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Ant Design Vue](https://antdv.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia](https://pinia.vuejs.org/)
- [DummyJSON API](https://dummyjson.com/)
