# 🏥 Advanced Homeopathy Clinic Management System

A comprehensive, next-level homeopathy clinic management application built with **Next.js 15**, **React 19**, **Appwrite**, and modern UI components.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Google OAuth Integration** - Seamless login with Google accounts
- **Role-based Access Control** - Admin and Patient roles
- **Secure Session Management** - JWT-based authentication

### 👥 Patient Management
- **Comprehensive Patient Profiles** - Complete demographic and medical information
- **Advanced Search & Filtering** - Find patients quickly with multiple filters
- **Patient History Tracking** - Complete medical history and consultation records
- **Habit Tracking System** - Monitor patient lifestyle and health patterns

### 🩺 Consultation Management
- **Detailed Consultation Forms** - Comprehensive medical examination records
- **Voice Input Support** - English and Bengali voice recognition
- **Vital Signs Tracking** - BP, Pulse, Temperature monitoring
- **Chief Complaints Management** - Multiple complaint tracking

### 💊 Prescription System
- **Medicine Database** - Comprehensive homeopathic medicine catalog
- **Dosage Instructions** - Predefined and custom instruction templates
- **Prescription History** - Complete medication tracking
- **Print-ready Prescriptions** - Professional prescription formatting

### 🏢 Chamber Management
- **Multiple Chamber Support** - Manage multiple clinic locations
- **Chamber-specific Consultations** - Location-based consultation tracking
- **Chamber Switching** - Easy switching between locations

### 📊 Analytics & Reporting
- **Patient Statistics** - Comprehensive patient analytics
- **Consultation Reports** - Detailed consultation insights
- **Revenue Tracking** - Financial reporting and analytics
- **Export Capabilities** - Data export in multiple formats

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching capability
- **Advanced Components** - shadcn/ui component library
- **Smooth Animations** - Framer Motion animations
- **Professional Landing Page** - Marketing-focused homepage

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Appwrite (BaaS)
- **UI Library**: shadcn/ui, Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Appwrite Auth with Google OAuth
- **Voice Recognition**: Web Speech API
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Appwrite Cloud account or self-hosted Appwrite instance
- Google OAuth credentials
- Modern web browser with speech recognition support

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/homeopathy-clinic-app.git
cd homeopathy-clinic-app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_SECRET_KEY=your_api_secret_key

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id

# Collection IDs
NEXT_PUBLIC_COLLECTION_PATIENTS_ID=patients_collection_id
NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID=consultations_collection_id
NEXT_PUBLIC_COLLECTION_CHAMBERS_ID=chambers_collection_id
NEXT_PUBLIC_COLLECTION_MEDICINES_ID=medicines_collection_id
NEXT_PUBLIC_COLLECTION_MEDICINEINSTRUCTIONS_ID=instructions_collection_id
NEXT_PUBLIC_COLLECTION_HABIT_DEFINITIONS_ID=habit_definitions_collection_id
NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID=patient_habits_collection_id

# Optional: Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🗄️ Appwrite Configuration

### Database Setup

Create a new database in your Appwrite console and note the Database ID.

### Collections Configuration

#### 1. **Patients Collection**
\`\`\`json
{
  "name": "patients",
  "attributes": [
    {
      "key": "name",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "patientId",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "age",
      "type": "integer",
      "required": true,
      "min": 0,
      "max": 150
    },
    {
      "key": "dob",
      "type": "datetime",
      "required": false
    },
    {
      "key": "gender",
      "type": "string",
      "size": 20,
      "required": true
    },
    {
      "key": "phoneNumber",
      "type": "string",
      "size": 20,
      "required": true
    },
    {
      "key": "address",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "occupation",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "bloodGroup",
      "type": "string",
      "size": 10,
      "required": false
    },
    {
      "key": "notes",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "firstConsultationDate",
      "type": "datetime",
      "required": false
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "idx_patientId",
      "type": "unique",
      "attributes": ["patientId"]
    },
    {
      "key": "idx_phoneNumber",
      "type": "key",
      "attributes": ["phoneNumber"]
    },
    {
      "key": "idx_name",
      "type": "fulltext",
      "attributes": ["name"]
    },
    {
      "key": "idx_gender",
      "type": "key",
      "attributes": ["gender"]
    },
    {
      "key": "idx_active",
      "type": "key",
      "attributes": ["isActive"]
    },
    {
      "key": "idx_firstConsultation",
      "type": "key",
      "attributes": ["firstConsultationDate"]
    }
  ]
}
\`\`\`

#### 2. **Consultations Collection**
\`\`\`json
{
  "name": "consultations",
  "attributes": [
    {
      "key": "patientId",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "chamberId",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "consultationDate",
      "type": "datetime",
      "required": true
    },
    {
      "key": "consultationTime",
      "type": "string",
      "size": 10,
      "required": false
    },
    {
      "key": "chiefComplaint",
      "type": "string",
      "size": 5000,
      "required": true,
      "array": true
    },
    {
      "key": "symptoms",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "BP",
      "type": "string",
      "size": 20,
      "required": false
    },
    {
      "key": "Pulse",
      "type": "string",
      "size": 20,
      "required": false
    },
    {
      "key": "Temp",
      "type": "string",
      "size": 20,
      "required": false
    },
    {
      "key": "historyOfPresentIllness",
      "type": "string",
      "size": 3000,
      "required": false
    },
    {
      "key": "familyHistory",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "otherComplaints",
      "type": "string",
      "size": 1000,
      "required": false,
      "array": true
    },
    {
      "key": "diagnosis",
      "type": "string",
      "size": 1000,
      "required": true,
      "array": true
    },
    {
      "key": "O_E",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "prescriptions",
      "type": "string",
      "size": 10000,
      "required": false,
      "array": true
    },
    {
      "key": "prescriptionNotes",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "dosageInstructions",
      "type": "string",
      "size": 1000,
      "required": false,
      "array": true
    },
    {
      "key": "dietAndLifestyleAdvice",
      "type": "string",
      "size": 1000,
      "required": false,
      "array": true
    },
    {
      "key": "followUpDate",
      "type": "datetime",
      "required": false
    },
    {
      "key": "billAmount",
      "type": "double",
      "required": false,
      "min": 0
    },
    {
      "key": "notes",
      "type": "string",
      "size": 2000,
      "required": false
    }
  ],
  "indexes": [
    {
      "key": "idx_patientId",
      "type": "key",
      "attributes": ["patientId"]
    },
    {
      "key": "idx_chamberId",
      "type": "key",
      "attributes": ["chamberId"]
    },
    {
      "key": "idx_consultationDate",
      "type": "key",
      "attributes": ["consultationDate"],
      "orders": ["DESC"]
    },
    {
      "key": "idx_patient_date",
      "type": "key",
      "attributes": ["patientId", "consultationDate"],
      "orders": ["ASC", "DESC"]
    },
    {
      "key": "idx_followUp",
      "type": "key",
      "attributes": ["followUpDate"]
    }
  ]
}
\`\`\`

#### 3. **Chambers Collection**
\`\`\`json
{
  "name": "chambers",
  "attributes": [
    {
      "key": "chamberName",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "location",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "contactNumber",
      "type": "string",
      "size": 20,
      "required": false
    },
    {
      "key": "operatingHours",
      "type": "string",
      "size": 200,
      "required": false
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "idx_chamberName",
      "type": "unique",
      "attributes": ["chamberName"]
    },
    {
      "key": "idx_active",
      "type": "key",
      "attributes": ["isActive"]
    },
    {
      "key": "idx_location",
      "type": "fulltext",
      "attributes": ["location"]
    }
  ]
}
\`\`\`

#### 4. **Medicines Collection**
\`\`\`json
{
  "name": "medicines",
  "attributes": [
    {
      "key": "medicineName",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "potency",
      "type": "string",
      "size": 50,
      "required": false
    },
    {
      "key": "medicineType",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "manufacturer",
      "type": "string",
      "size": 200,
      "required": false
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "indications",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "dosageForm",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "idx_medicineName",
      "type": "fulltext",
      "attributes": ["medicineName"]
    },
    {
      "key": "idx_potency",
      "type": "key",
      "attributes": ["potency"]
    },
    {
      "key": "idx_type",
      "type": "key",
      "attributes": ["medicineType"]
    },
    {
      "key": "idx_active",
      "type": "key",
      "attributes": ["isActive"]
    },
    {
      "key": "idx_manufacturer",
      "type": "key",
      "attributes": ["manufacturer"]
    }
  ]
}
\`\`\`

#### 5. **Medicine Instructions Collection**
\`\`\`json
{
  "name": "medicineInstructions",
  "attributes": [
    {
      "key": "instructionText",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "instructionType",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "language",
      "type": "string",
      "size": 10,
      "required": false,
      "default": "en"
    },
    {
      "key": "category",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "idx_instructionText",
      "type": "fulltext",
      "attributes": ["instructionText"]
    },
    {
      "key": "idx_type",
      "type": "key",
      "attributes": ["instructionType"]
    },
    {
      "key": "idx_language",
      "type": "key",
      "attributes": ["language"]
    },
    {
      "key": "idx_active",
      "type": "key",
      "attributes": ["isActive"]
    },
    {
      "key": "idx_category",
      "type": "key",
      "attributes": ["category"]
    }
  ]
}
\`\`\`

#### 6. **Habit Definitions Collection**
\`\`\`json
{
  "name": "habitDefinitions",
  "attributes": [
    {
      "key": "name",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "inputType",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "options",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "category",
      "type": "string",
      "size": 100,
      "required": false
    },
    {
      "key": "unit",
      "type": "string",
      "size": 50,
      "required": false
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": true,
      "default": true
    }
  ],
  "indexes": [
    {
      "key": "idx_name",
      "type": "unique",
      "attributes": ["name"]
    },
    {
      "key": "idx_inputType",
      "type": "key",
      "attributes": ["inputType"]
    },
    {
      "key": "idx_category",
      "type": "key",
      "attributes": ["category"]
    },
    {
      "key": "idx_active",
      "type": "key",
      "attributes": ["isActive"]
    }
  ]
}
\`\`\`

#### 7. **Patient Habits Collection**
\`\`\`json
{
  "name": "patientHabits",
  "attributes": [
    {
      "key": "patientId",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "habitDefinitionId",
      "type": "string",
      "size": 50,
      "required": true
    },
    {
      "key": "value",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "notes",
      "type": "string",
      "size": 1000,
      "required": false
    },
    {
      "key": "recordedDate",
      "type": "datetime",
      "required": true
    },
    {
      "key": "consultationId",
      "type": "string",
      "size": 50,
      "required": false
    }
  ],
  "indexes": [
    {
      "key": "idx_patientId",
      "type": "key",
      "attributes": ["patientId"]
    },
    {
      "key": "idx_habitDefinitionId",
      "type": "key",
      "attributes": ["habitDefinitionId"]
    },
    {
      "key": "idx_recordedDate",
      "type": "key",
      "attributes": ["recordedDate"],
      "orders": ["DESC"]
    },
    {
      "key": "idx_patient_habit",
      "type": "key",
      "attributes": ["patientId", "habitDefinitionId"]
    },
    {
      "key": "idx_consultation",
      "type": "key",
      "attributes": ["consultationId"]
    }
  ]
}
\`\`\`

### Authentication Setup

#### 1. **Google OAuth Configuration**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[PROJECT_ID]`
   - `http://localhost:3000/auth/callback` (for development)

#### 2. **Appwrite Auth Settings**
1. In Appwrite Console, go to Auth → Settings
2. Add Google as OAuth2 Provider
3. Enter your Google Client ID and Client Secret
4. Configure success and failure URLs:
   - Success: `http://localhost:3000/dashboard` (development)
   - Failure: `http://localhost:3000/auth/failure`

#### 3. **User Roles & Labels**
- **Admin Users**: Add label `admin` to user accounts that should have dashboard access
- **Patient Users**: No labels required (default patient role)

### Permissions Configuration

For each collection, set the following permissions:

#### Read Permissions:
- `users` (authenticated users can read)
- `role:admin` (admin users have full access)

#### Write Permissions:
- `role:admin` (only admin users can create/update/delete)

#### Security Rules:
- Enable **Document Security** for all collections
- Set appropriate **Attribute Security** for sensitive fields

## 🎯 Usage Guide

### For Administrators

1. **Login**: Use Google OAuth to sign in
2. **Dashboard Access**: Ensure your account has the `admin` label
3. **Patient Management**: 
   - Add new patients with comprehensive forms
   - Search and filter existing patients
   - View detailed patient profiles
4. **Consultation Management**:
   - Create detailed consultation records
   - Track patient history and progress
   - Manage prescriptions and treatments
5. **System Management**:
   - Manage chambers, medicines, and instructions
   - Configure habit definitions
   - Monitor system analytics

### For Patients

1. **Login**: Use Google OAuth to sign in
2. **Profile Access**: View personal medical records
3. **Appointment History**: Review past consultations
4. **Prescription Access**: View current and past prescriptions

## 🔧 Development

### Project Structure
\`\`\`
homeopathy-clinic-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Protected dashboard routes
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── common/           # Common components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── services/             # API services
├── store/                # Zustand stores
├── schemas/              # Zod validation schemas
└── styles/               # Global styles
\`\`\`

### Key Commands
\`\`\`bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npm run type-check
\`\`\`

### Environment Setup
- **Development**: `npm run dev`
- **Production**: `npm run build && npm start`
- **Testing**: `npm run test`

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Upload build files to your hosting provider
3. Configure environment variables on the server
4. Start the application: `npm start`

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **API Keys**: Use Appwrite's built-in security features
- **User Authentication**: Implement proper session management
- **Data Validation**: Use Zod schemas for all form inputs
- **CORS Configuration**: Configure Appwrite CORS settings properly

## 🐛 Troubleshooting

### Common Issues

1. **Appwrite Connection Issues**
   - Verify endpoint URL and project ID
   - Check network connectivity
   - Ensure API keys are correct

2. **Authentication Problems**
   - Verify Google OAuth configuration
   - Check redirect URLs
   - Ensure user has proper labels/roles

3. **Form Submission Errors**
   - Check Zod schema validation
   - Verify collection permissions
   - Review browser console for errors

4. **Voice Input Not Working**
   - Ensure HTTPS connection (required for speech recognition)
   - Check browser permissions for microphone access
   - Verify browser compatibility

## 📈 Performance Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Use Next.js Image component
- **Caching**: Implement React Query caching strategies
- **Bundle Analysis**: Use `@next/bundle-analyzer`
- **Database Optimization**: Proper indexing in Appwrite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Appwrite Team** - For the excellent Backend-as-a-Service platform
- **shadcn** - For the beautiful UI component library
- **Vercel** - For the seamless deployment platform

## 📞 Support

For support and questions:
- 📧 Email: support@homeopathyclinic.com
- 💬 Discord: [Join our community](https://discord.gg/homeopathyclinic)
- 📖 Documentation: [docs.homeopathyclinic.com](https://docs.homeopathyclinic.com)

---

**Built with ❤️ for the homeopathy community**
\`\`\`

Now let me create the enhanced landing page components:
