# 🏥 Popular Homeo Care - Next-Level Homeopathic Clinic Management System

A **premium, professional-grade** homeopathic clinic management system built with **Next.js 14**, **React 18**, and **Appwrite**. This system provides comprehensive patient management, consultation tracking, prescription handling, and advanced features designed specifically for homeopathic practitioners.

## 🚀 Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, JSX
- **UI Library:** Shadcn/ui, Tailwind CSS
- **Data Fetching:** TanStack Query (React Query)
- **Backend:** Appwrite (BaaS)
- **Authentication:** Google OAuth (Appwrite Auth)
- **State Management:** React Query + Context API + Zustand
- **Animations:** Framer Motion, Tailwind CSS Animations
- **Voice Input:** Web Speech API
- **QR Code:** QR Code Generation for Prescriptions
- **Tables:** TanStack Table for advanced data display
- **Notifications:** Sonner for toast notifications
- **Icon Library:** Lucide React

## 📋 Core Features

### 🧑‍⚕️ Advanced Patient Management
- Complete patient profile creation and editing
- Unique phone number and serial number identification
- Comprehensive patient history tracking
- Advanced search and filtering with debounced input
- Patient timeline and consultation history
- Professional patient cards with quick actions
- Infinity scroll for large patient lists
- Smart age calculation from date of birth

### 📋 Comprehensive Consultation System
- Detailed consultation records with tabbed interface
- Chief complaint and symptom tracking
- Medical history and family history
- General and systemic examination
- Disease diagnosis and treatment planning
- Follow-up date scheduling
- Chamber-based billing system
- Professional consultation history table

### 💊 Advanced Prescription Management
- Digital prescription creation
- Medicine name, potency, and dosage
- Treatment duration tracking
- Prescription history
- QR code enabled prescriptions
- Patients can scan QR to view prescriptions
- Professional print layouts

### 🧘 Dynamic Patient Habits Tracking
- Configurable habit definitions by doctors
- Multiple input types:
  - Boolean (Yes/No)
  - Scale (1-10 rating)
  - Select dropdown options
  - Text and number inputs
- Consultation-based habit tracking
- Habit trend analysis and visualization
- Professional habit display cards

### 🏥 Multi-Chamber Management
- Multiple chamber support
- Chamber switching functionality
- Chamber-based reporting
- Contact information and opening hours
- Professional chamber selection interface

### 🎤 Voice Input Integration
- Bengali voice recognition
- All text fields support voice input
- Hands-free data entry
- Professional voice input UI

### 📊 Advanced Data Tables
- TanStack Table integration
- Sortable and filterable columns
- Pagination and infinite scroll
- Professional table layouts
- Export functionality
- Advanced search capabilities

## 🎯 Technical Excellence

### 🏗️ Architecture
- **Business-class UI/UX** with shadcn/ui components
- **Responsive design** optimized for all devices
- **TanStack Query** for efficient data fetching and caching
- **Professional animations** and smooth transitions
- **Type-safe development** approach
- **Performance optimized** with intelligent caching
- **Modular component architecture**

### 🔧 Advanced Hooks & Services
- Custom React hooks for all data operations
- Reusable service layer for Appwrite integration
- Optimistic updates for better UX
- Error handling and retry mechanisms
- Professional loading states

### 🎨 UI/UX Features
- **Dark/Light mode** with system detection
- **Sticky headers** across all pages
- **Professional sidebar** with chamber switching
- **Command palette** (Ctrl+K) for quick navigation
- **Breadcrumb navigation**
- **Toast notifications** for user feedback
- **Loading skeletons** for better perceived performance

## 📊 Database Schema

### Patients Collection
\`\`\`javascript
{
  $id: string (pk),
  name: string (required),
  age: integer (required),
  dob: datetime (optional),
  gender: enum (required), // "Male", "Female", "Other"
  address: string (optional),
  phoneNumber: string (required, unique),
  occupation: string (optional),
  patientId: string (required, unique), // Serial number
  bloodGroup: string (optional),
  notes: string (optional),
  firstConsultationDate: datetime (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### Consultations Collection
\`\`\`javascript
{
  $id: string (pk),
  patientId: string (relationship to Patients, required),
  chamberId: string (relationship to Chambers, required),
  consultationDate: datetime (required),
  chiefComplaint: string[] (required),
  otherComplaints: string[] (optional),
  symptoms: string (optional),
  BP: string (optional),
  Pulse: string (optional),
  Temp: string (optional),
  O_E: string (optional), // On Examination
  historyOfPresentIllness: string (optional),
  familyHistory: string (optional),
  diagnosis: string[] (required),
  prescriptions: string[] (optional),
  dosageInstructions: string[] (optional),
  dietAndLifestyleAdvice: string[] (optional),
  prescriptionNotes: string (optional),
  notes: string (optional),
  followUpDate: datetime (optional),
  billAmount: double (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### Chambers Collection
\`\`\`javascript
{
  $id: string (pk),
  chamberName: string (required),
  location: string (required),
  contactNumber: string (optional),
  email: string (optional),
  openingHours: string (optional),
  consultationFee: double (optional),
  isActive: boolean (required, default: true),
  notes: string (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### Medicines Collection
\`\`\`javascript
{
  $id: string (pk),
  medicineName: string (required),
  potency: string (optional),
  category: string (optional),
  manufacturer: string (optional),
  description: string (optional),
  isActive: boolean (required, default: true),
  createdAt: datetime (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### MedicineInstructions Collection
\`\`\`javascript
{
  $id: string (pk),
  instructionText: string (required),
  category: string (optional),
  isCommon: boolean (default: false),
  isActive: boolean (required, default: true),
  createdAt: datetime (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### HabitDefinitions Collection
\`\`\`javascript
{
  $id: string (pk),
  name: string (required),
  description: string (optional),
  inputType: enum (required), // text, number, boolean, scale, select
  options: string (optional), // JSON array for select type
  category: string (optional),
  isActive: boolean (required, default: true),
  createdAt: datetime (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### PatientsHabits Collection
\`\`\`javascript
{
  $id: string (pk),
  habitDefinitionId: string (relationship to HabitDefinitions, required),
  patientId: string (relationship to Patients, required),
  consultationId: string (relationship to Consultations, optional),
  value: string (required),
  notes: string (optional),
  recordedDate: datetime (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Appwrite server setup
- Google OAuth app created

### 1. Clone Project & Install Dependencies

\`\`\`bash
git clone <repository-url>
cd popular-homeo-care
npm install
\`\`\`

### 2. Environment Variables Setup

Create `.env.local` file:

\`\`\`env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id

# Collection IDs
NEXT_PUBLIC_COLLECTION_PATIENTS_ID=patients-collection-id
NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID=consultations-collection-id
NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID=patient-habits-collection-id
NEXT_PUBLIC_COLLECTION_HABIT_DEFINITIONS_ID=habit-definitions-collection-id
NEXT_PUBLIC_COLLECTION_MEDICINES_ID=medicines-collection-id
NEXT_PUBLIC_COLLECTION_MEDICINEINSTRUCTIONS_ID=medicine-instructions-collection-id
NEXT_PUBLIC_COLLECTION_CHAMBERS_ID=chambers-collection-id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

### 3. Appwrite Database Setup

#### Create Database
1. Login to Appwrite console
2. Create new project
3. Create database

#### Create Collections

##### Patients Collection
\`\`\`bash
Collection ID: patients
Attributes:
- name (string, 255, required)
- age (integer, required)
- dob (datetime, optional)
- gender (enum, required) // Male, Female, Other
- address (string, 500, optional)
- phoneNumber (string, 15, required, unique)
- occupation (string, 100, optional)
- patientId (string, 50, required, unique)
- bloodGroup (string, 10, optional)
- notes (string, 1000, optional)
- firstConsultationDate (datetime, required)

Indexes:
- phoneNumber (unique)
- patientId (unique)
- name (fulltext)
- firstConsultationDate (key)
\`\`\`

##### Consultations Collection
\`\`\`bash
Collection ID: consultations
Attributes:
- patientId (string, 255, required)
- chamberId (string, 255, required)
- consultationDate (datetime, required)
- chiefComplaint (string[], required)
- otherComplaints (string[], optional)
- symptoms (string, 2000, optional)
- BP (string, 20, optional)
- Pulse (string, 20, optional)
- Temp (string, 20, optional)
- O_E (string, 2000, optional)
- historyOfPresentIllness (string, 2000, optional)
- familyHistory (string, 1000, optional)
- diagnosis (string[], required)
- prescriptions (string[], optional)
- dosageInstructions (string[], optional)
- dietAndLifestyleAdvice (string[], optional)
- prescriptionNotes (string, 1000, optional)
- notes (string, 1000, optional)
- followUpDate (datetime, optional)
- billAmount (double, optional)

Indexes:
- patientId
- consultationDate
- chamberId
- followUpDate (key)
\`\`\`

##### Chambers Collection
\`\`\`bash
Collection ID: chambers
Attributes:
- chamberName (string, 100, required)
- location (string, 200, required)
- contactNumber (string, 15, optional)
- email (string, 100, optional)
- openingHours (string, 200, optional)
- consultationFee (double, optional)
- isActive (boolean, required, default: true)
- notes (string, 500, optional)

Indexes:
- chamberName (key)
- isActive (key)
\`\`\`

##### Medicines Collection
\`\`\`bash
Collection ID: medicines
Attributes:
- medicineName (string, 200, required)
- potency (string, 50, optional)
- category (string, 100, optional)
- manufacturer (string, 100, optional)
- description (string, 500, optional)
- isActive (boolean, required, default: true)
- createdAt (datetime, required)

Indexes:
- medicineName (fulltext)
- category (key)
- isActive (key)
\`\`\`

##### MedicineInstructions Collection
\`\`\`bash
Collection ID: medicineInstructions
Attributes:
- instructionText (string, 300, required)
- category (string, 100, optional)
- isCommon (boolean, default: false)
- isActive (boolean, required, default: true)
- createdAt (datetime, required)

Indexes:
- instructionText (fulltext)
- isCommon (key)
- isActive (key)
\`\`\`

##### HabitDefinitions Collection
\`\`\`bash
Collection ID: habitDefinitions
Attributes:
- name (string, 100, required)
- description (string, 300, optional)
- inputType (enum, required) // text, number, boolean, scale, select
- options (string, 1000, optional) // JSON array for select type
- category (string, 100, optional)
- isActive (boolean, required, default: true)
- createdAt (datetime, required)

Indexes:
- name (key)
- category (key)
- isActive (key)
\`\`\`

##### PatientsHabits Collection
\`\`\`bash
Collection ID: patientsHabits
Attributes:
- habitDefinitionId (string, 255, required)
- patientId (string, 255, required)
- consultationId (string, 255, optional)
- value (string, 500, required)
- notes (string, 500, optional)
- recordedDate (datetime, required)

Indexes:
- patientId (key)
- habitDefinitionId (key)
- consultationId (key)
- recordedDate (key)
\`\`\`

## 🚀 Run Application

\`\`\`bash
npm run dev
\`\`\`

Application will start at `http://localhost:3000`.

## 📁 Project Structure

\`\`\`
popular-homeo-care/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Main application
│   │   ├── patients/      # Patient management
│   │   │   ├── new/       # Add new patient
│   │   │   └── [id]/      # Patient details & edit
│   │   ├── consultations/ # Consultation management
│   │   ├── chambers/      # Chamber management
│   │   ├── medicines/     # Medicine management
│   │   └── habit-definitions/ # Habit definitions
│   ├── api/               # API routes
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components
│   │   ├── Header.jsx    # Main header with chamber selector
│   │   ├── Sidebar.jsx   # Navigation sidebar
│   │   └── ChamberSelector.jsx # Chamber switching
│   ├── forms/            # Form components
│   │   ├── PatientConsultationForm.jsx # Main form
│   │   ├── PatientDetailsForm.jsx      # Patient tab
│   │   ├── ConsultationDetailsForm.jsx # Consultation tab
│   │   ├── PrescriptionForm.jsx        # Prescription tab
│   │   ├── HabitForm.jsx              # Habits tab
│   │   └── FormActions.jsx            # Form actions
│   ├── patients/         # Patient-specific components
│   ├── common/           # Common components
│   └── landing/          # Landing page components
├── lib/                   # Utilities and configurations
├── services/             # Appwrite service functions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
│   ├── chamberStore.js   # Chamber state management
│   ├── medicineStore.js  # Medicine state
│   └── instructionStore.js # Instruction state
├── schemas/              # Zod validation schemas
│   └── patientConsultation.schema.js
├── providers/            # Context providers
├── constants/            # App constants
└── styles/               # Global styles
\`\`\`

## 🔐 Security Features

- Google OAuth secure authentication
- Role-based access control
- Data encryption
- Session management
- CORS protection
- Input validation and sanitization
- Secure API endpoints
- Secure file upload with type validation

## 📈 Performance Optimizations

- React Query data caching and synchronization
- Debounced search inputs
- Lazy loading components
- Image optimization
- Code splitting
- Bundle optimization
- Infinite scroll for large datasets
- Optimistic updates

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Responsiveness

- Mobile-first approach
- Touch-friendly interface
- Responsive tables and forms
- Optimized for tablets and phones
- Progressive Web App capabilities

## 🎯 Key Features Highlights

### Professional Dashboard
- Sticky header with breadcrumbs
- Collapsible sidebar with chamber switching
- Real-time notifications
- Command palette for quick navigation
- Professional theme switching

### Advanced Patient Management
- Comprehensive patient profiles
- Consultation history with TanStack Table
- Patient habits tracking and trends
- Timeline view of patient interactions
- Professional patient cards

### Intelligent Search & Filtering
- Debounced search inputs
- Advanced filtering options
- Real-time search results
- Professional search UI

### Business-Class Forms
- Multi-tab form interfaces
- Voice input integration
- Professional validation
- Optimistic updates
- Auto-save capabilities

## 📞 Support & Documentation

### Help Resources
- In-app help center
- Video tutorials
- FAQ section
- Professional documentation

### Contact
- Email: support@popularhomeocare.com
- Phone: +880 1712-345678
- Website: https://popularhomeocare.com

## 📄 License

This project is licensed under the MIT License.

---

**Popular Homeo Care** - A complete solution for modern homeopathic clinic management with professional UI/UX, advanced features, and business-class architecture.

### Ready for Production

This system is **production-ready** with:
- ✅ Professional UI/UX design
- ✅ Complete form submission functionality
- ✅ Advanced data management with caching
- ✅ Multi-chamber support with active chamber selection
- ✅ Voice input integration for Bengali language
- ✅ Comprehensive patient management system
- ✅ Advanced consultation tracking with habits
- ✅ Professional prescription management with QR codes
- ✅ Business-class architecture and performance optimization

**Start managing your homeopathic practice with confidence!** 🏥✨
