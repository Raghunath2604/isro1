# 🎨 AS³ UI/UX Component Library

Professional, polished component library for the AS³ Platform with animations, transitions, and accessibility standards.

## 📦 Available Components

### 1. **Button Component**
Professional buttons with multiple variants and states

```jsx
import { Button } from './components/UIComponents'

// Primary button
<Button variant="primary" size="md">
  Deploy Mission
</Button>

// Secondary button
<Button variant="secondary">
  Cancel
</Button>

// Danger button
<Button variant="danger">
  Delete
</Button>

// Ghost button
<Button variant="ghost">
  Learn More
</Button>

// With icon
import { Rocket } from 'lucide-react'
<Button icon={Rocket}>
  Launch
</Button>

// Loading state
<Button loading>
  Processing...
</Button>

// Disabled
<Button disabled>
  Not Available
</Button>
```

**Variants:** primary, secondary, danger, ghost, outline
**Sizes:** sm, md, lg
**Features:** Loading state, icons, disabled state, smooth transitions

---

### 2. **Input Component**
Refined form inputs with validation states

```jsx
import { Input } from './components/UIComponents'
import { Search } from 'lucide-react'

// Basic input
<Input
  label="Spacecraft ID"
  placeholder="Enter ID"
  value={id}
  onChange={(e) => setId(e.target.value)}
/>

// With icon
<Input
  icon={Search}
  placeholder="Search missions..."
/>

// With validation
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Invalid email format"
/>

// Success state
<Input
  label="Password"
  value={password}
  success
/>
```

**Features:** Icons, labels, error messages, success state, smooth focus

---

### 3. **Card Component**
Versatile card containers with hover effects

```jsx
import { Card } from './components/UIComponents'

// Basic card
<Card>
  <h3>Mission Status</h3>
  <p>All systems operational</p>
</Card>

// Hoverable card
<Card hoverable gradient>
  <div className="space-y-2">
    <h4>ISS-01</h4>
    <p>Orbital velocity: 7.66 km/s</p>
  </div>
</Card>
```

**Features:** Hover effects, gradients, smooth transitions

---

### 4. **Badge Component**
Status indicators and tags

```jsx
import { Badge } from './components/UIComponents'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Caution</Badge>
<Badge variant="danger">Critical</Badge>
<Badge variant="default">Info</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

**Variants:** default, success, warning, danger
**Sizes:** sm, md, lg

---

### 5. **Animated Card Component**
Enhanced cards with hover animations and scale effects

```jsx
import { AnimatedCard } from './components/AnimatedComponents'
import { Satellite } from 'lucide-react'

<AnimatedCard
  title="Spacecraft Status"
  subtitle="Real-time monitoring"
  icon={Satellite}
  isActive={true}
  onClick={() => handleSelectSpacecraft()}
>
  <p>Altitude: 408 km</p>
  <p>Velocity: 7.66 km/s</p>
</AnimatedCard>
```

**Features:** Hover scale, glow effects, smooth animations, active state

---

### 6. **Stat Card Component**
Display metrics with trends

```jsx
import { StatCard } from './components/AnimatedComponents'
import { TrendingUp } from 'lucide-react'

<StatCard
  label="Temperature"
  value={156}
  unit="°C"
  icon={TrendingUp}
  trend={-5}
  color="cyan"
/>
```

**Colors:** cyan, green, purple, orange
**Features:** Icon support, trend indicators, responsive

---

### 7. **Loading Components**
Professional loading states

```jsx
import {
  LoadingSpinner,
  SkeletonLoader,
  CardSkeleton,
  PanelLoading,
  FullPageLoading
} from './components/Loading'

// Spinner
<LoadingSpinner size="md" text="Loading..." />

// Skeleton loader
<SkeletonLoader lines={3} />

// Card skeleton
<CardSkeleton />

// Panel loading
<PanelLoading title="Analyzing Data..." />

// Full page
<FullPageLoading message="Initializing AS³ Platform..." />
```

---

### 8. **Error Boundary Component**
Graceful error handling

```jsx
import ErrorBoundary from './components/ErrorBoundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:** Error details (dev mode), recovery buttons, error ID

---

### 9. **Toast Notifications**
Non-intrusive feedback messages

```jsx
import { ToastProvider, useToast } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  )
}

// In any component:
function MyComponent() {
  const toast = useToast()

  return (
    <>
      <button onClick={() => toast.success('Mission deployed!')}>
        Deploy
      </button>
      <button onClick={() => toast.error('Connection lost')}>
        Fail
      </button>
    </>
  )
}
```

**Types:** success, error, warning, info
**Features:** Auto-dismiss, smooth animations, smooth exit

---

### 10. **Feature Item Component**
List items with icons and descriptions

```jsx
import { FeatureItem } from './components/AnimatedComponents'
import { Zap } from 'lucide-react'

<FeatureItem
  icon={Zap}
  title="Real-Time Updates"
  description="Live telemetry data from spacecraft"
  onClick={() => navigateTo('/telemetry')}
/>
```

---

### 11. **Progress Ring Component**
Circular progress indicator

```jsx
import { ProgressRing } from './components/AnimatedComponents'

<ProgressRing
  percentage={75}
  label="Mission Progress"
  size="md"
/>
```

**Sizes:** sm, md, lg
**Features:** Smooth animation, centered label

---

## 🎨 CSS Animation Classes

### Entrance Animations
```html
<div className="animate-fade-in-up">Fades in from bottom</div>
<div className="animate-fade-in-down">Fades in from top</div>
<div className="animate-slide-in-left">Slides in from left</div>
<div className="animate-slide-in-right">Slides in from right</div>
```

### Continuous Animations
```html
<div className="animate-float">Gentle floating motion</div>
<div className="animate-glow-pulse">Pulsing glow effect</div>
<div className="animate-shimmer">Shimmer loading effect</div>
```

### Effects
```html
<div className="hover-lift">Lifts on hover</div>
<div className="hover-glow">Glows on hover</div>
<div className="hover-scale">Scales on hover</div>
```

---

## 🎯 CSS Utility Classes

### Glass Morphism
```html
<div className="glass">Basic glass effect</div>
<div className="glass-hover">Interactive glass</div>
```

### Shadows
```html
<div className="shadow-glow-sm">Small glow</div>
<div className="shadow-glow-md">Medium glow</div>
<div className="shadow-glow-lg">Large glow</div>
<div className="shadow-glow-cyan">Cyan glow</div>
<div className="shadow-glow-purple">Purple glow</div>
```

### Text
```html
<div className="text-glow">Glowing text</div>
<div className="gradient-text">Gradient text</div>
```

### Transitions
```html
<div className="transition-smooth">0.3s smooth</div>
<div className="transition-fast">0.15s fast</div>
<div className="transition-slow">0.5s slow</div>
```

---

## 🎭 CSS Component Classes

### Buttons
```html
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-ghost">Ghost</button>
<button className="btn-danger">Danger</button>
```

### Badges
```html
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
```

### Cards & Panels
```html
<div className="card">Basic card</div>
<div className="card-elevated">Elevated card</div>
<div className="card-interactive">Interactive card</div>
<div className="grid-panel">Grid panel</div>
```

### Metrics
```html
<div className="metric-card">
  <div className="metric-label">Altitude</div>
  <div className="metric-value">408 km</div>
</div>
```

---

## ✨ Design System Principles

### **1. Consistency**
All components follow the same design language with:
- Unified color palette (cyan, blue, purple, green, orange)
- Consistent spacing and sizing
- Smooth transitions (0.2s - 0.5s)
- Professional typography hierarchy

### **2. Smooth Interactions**
- Micro-animations on hover
- Scale and glow effects
- Smooth color transitions
- Loading states with spinners

### **3. Accessibility**
- Focus states visible
- Keyboard navigation support
- Color contrast WCAG AA compliant
- Reduced motion support

### **4. Responsiveness**
- Mobile-first design
- Adaptive spacing
- Touch-friendly buttons (44px+ height)
- Flexible layouts

---

## 🚀 Best Practices

### Component Usage
```jsx
// ✅ GOOD - Proper spacing and organization
<div className="space-y-4">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>

// ✅ GOOD - Using variants for visual hierarchy
<div className="flex gap-2">
  <Button variant="primary">Confirm</Button>
  <Button variant="ghost">Cancel</Button>
</div>
```

### Animation Usage
```jsx
// ✅ GOOD - Entrance animation for new content
<div className="animate-fade-in-up space-y-4">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>

// ✅ GOOD - Subtle hover effects
<Card hoverable className="hover-lift">
  Interactive content
</Card>
```

### Responsive Design
```jsx
// ✅ GOOD - Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</div>
```

---

## 📱 Mobile-First Approach

All components are optimized for:
- **Mobile (< 640px)** - Single column, larger touch targets
- **Tablet (640px - 1024px)** - Two columns, adjusted spacing
- **Desktop (> 1024px)** - Full layout, optimized spacing

---

## 🎓 Component Examples

### Dashboard Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {data.map(item => (
    <Card
      key={item.id}
      hoverable
      className="animate-fade-in-up hover-lift"
    >
      {item.content}
    </Card>
  ))}
</div>
```

### Action Bar
```jsx
<div className="flex gap-2 flex-wrap">
  <Button variant="primary" icon={Deploy}>Deploy</Button>
  <Button variant="secondary">Configure</Button>
  <Button variant="ghost">Help</Button>
</div>
```

### Status Display
```jsx
<Card className="space-y-2">
  <StatCard label="Status" value="Healthy" color="green" />
  <Badge variant="success">All Systems Online</Badge>
</Card>
```

---

## 🔄 Animations Timeline

All animations are carefully timed:
- **Entrance**: 0.4s - 0.5s (give content time to appear)
- **Hover**: 0.2s - 0.3s (quick, responsive feel)
- **Loading**: 2s - 3s (continuous, not distracting)
- **Exit**: 0.3s - 0.4s (smooth fade out)

---

## 📚 Resources

- **Tailwind CSS**: https://tailwindcss.com
- **Lucide React Icons**: https://lucide.dev
- **Animation Principles**: https://www.nngroup.com/articles/animation-usability/
- **Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

**Status**: ✅ Complete Component Library
**Last Updated**: 2026-03-24
**Quality Level**: ⭐⭐⭐⭐⭐ Enterprise Grade
