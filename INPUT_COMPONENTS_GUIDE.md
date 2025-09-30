# Input Components Guide

## Overview
This project uses improved input components that provide better UX, validation, and consistency across the application.

## Components Available

### ImprovedInput
Enhanced input component with built-in validation, icons, and better styling.

**Location**: `src/components/ui/ImprovedInput.tsx`

**Features**:
- Built-in validation with real-time feedback
- Icon support
- Loading states
- Success/error states
- Consistent styling
- Accessibility features

### ImprovedTextarea
Enhanced textarea component with similar features to ImprovedInput.

**Location**: `src/components/ui/ImprovedTextarea.tsx`

**Features**:
- Character count display
- Built-in validation
- Icon support
- Loading states
- Success/error states

## Usage Guidelines

### ✅ DO Use ImprovedInput/ImprovedTextarea
- **All new forms** - Use ImprovedInput for text inputs
- **All existing forms** - Replace regular Input with ImprovedInput
- **Validation required** - Use built-in validate prop
- **Icons needed** - Use icon prop for better UX
- **Consistent styling** - Maintain design system consistency

### ❌ DON'T Use Regular Input
- **New development** - Never use `@/components/ui/input`
- **Form updates** - Always replace with ImprovedInput
- **Validation** - Don't implement custom validation when built-in works

## Implementation Examples

### Basic Input
```tsx
import { ImprovedInput } from '@/components/ui/ImprovedInput';

<ImprovedInput
  id="email"
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email address"
  required
  icon={<Mail className="h-4 w-4" />}
  validate={(value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  }}
/>
```

### Textarea
```tsx
import { ImprovedTextarea } from '@/components/ui/ImprovedTextarea';

<ImprovedTextarea
  id="description"
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Enter description"
  maxLength={500}
  showCharCount
  validate={(value) => {
    if (!value) return 'Description is required';
    if (value.length < 10) return 'Must be at least 10 characters';
    return null;
  }}
/>
```

## Common Validation Patterns

### Email Validation
```tsx
validate={(value) => {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Please enter a valid email address';
  return null;
}}
```

### Name Validation
```tsx
validate={(value) => {
  if (!value) return 'Name is required';
  if (value.length < 2) return 'Must be at least 2 characters';
  return null;
}}
```

### Phone Validation
```tsx
validate={(value) => {
  if (!value) return null; // Optional field
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return 'Please enter a valid phone number';
  return null;
}}
```

### Password Validation
```tsx
validate={(value) => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Password must contain uppercase, lowercase, and number';
  return null;
}}
```

## Migration Checklist

When updating existing forms:

1. **Update Imports**
   ```tsx
   // Remove
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   
   // Add
   import { ImprovedInput } from '@/components/ui/ImprovedInput';
   import { ImprovedTextarea } from '@/components/ui/ImprovedTextarea';
   ```

2. **Replace Input Components**
   ```tsx
   // Before
   <div>
     <Label htmlFor="email">Email</Label>
     <Input id="email" value={email} onChange={handleChange} />
   </div>
   
   // After
   <ImprovedInput
     id="email"
     label="Email"
     value={email}
     onChange={handleChange}
     validate={validateEmail}
     icon={<Mail className="h-4 w-4" />}
   />
   ```

3. **Add Validation Functions**
   - Create validation functions for each field
   - Use consistent error messages
   - Handle required vs optional fields

4. **Add Icons**
   - Use appropriate Lucide React icons
   - Maintain consistency with design system
   - Use `className="h-4 w-4"` for standard size

5. **Test Functionality**
   - Verify validation works correctly
   - Check error states display properly
   - Ensure success states work
   - Test accessibility features

## Files Updated

### ✅ Completed
- `src/app/settings/page.tsx` - Profile settings form
- `src/app/login/page.tsx` - Login form
- `src/app/team/onboarding/page.tsx` - Team onboarding form (partial)

### 🔄 In Progress
- `src/app/team/page.tsx` - Team management page
- `src/app/features/toggles/page.tsx` - Feature toggles page
- `src/components/BusinessOverviewClient.tsx` - Business overview component

### 📋 Pending
- Any new forms or pages created
- Additional existing forms that need updating

## Future Development

### New Form Development
1. Always use ImprovedInput/ImprovedTextarea
2. Include proper validation
3. Add appropriate icons
4. Follow consistent patterns
5. Test thoroughly

### Maintenance
1. Regular audits of form components
2. Update any missed Input components
3. Ensure validation consistency
4. Keep documentation updated

## Benefits

- **Consistent UX** - All forms behave the same way
- **Better Validation** - Real-time feedback and clear error messages
- **Accessibility** - Built-in accessibility features
- **Maintainability** - Centralized component logic
- **Performance** - Optimized re-rendering and validation
- **Design System** - Consistent styling and behavior

---

**Last Updated**: December 2024
**Maintainer**: Development Team
