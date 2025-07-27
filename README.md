# 🏥 Popular Homeo Care - আধুনিক হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম

একটি সম্পূর্ণ, আধুনিক এবং পেশাদার হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম যা ডাক্তারদের রোগী, কনসালটেশন, প্রেসক্রিপশন এবং ক্লিনিক ডেটা দক্ষতার সাথে পরিচালনা করতে সাহায্য করে।

## 🚀 প্রযুক্তিগত স্ট্যাক

- **ফ্রন্টএন্ড:** Next.js 14 (App Router), React 18, JSX
- **UI লাইব্রেরি:** Shadcn/ui, Tailwind CSS
- **ডেটা ফেচিং:** TanStack Query (React Query)
- **ব্যাকএন্ড:** Appwrite (BaaS)
- **অথেন্টিকেশন:** Google OAuth (Appwrite Auth)
- **স্টেট ম্যানেজমেন্ট:** React Query + Context API
- **অ্যানিমেশন:** Framer Motion, Tailwind CSS Animations
- **ভয়েস ইনপুট:** Web Speech API
- **QR কোড:** QR Code Generation for Prescriptions

## 📋 মূল বৈশিষ্ট্যসমূহ

### 🧑‍⚕️ রোগী ব্যবস্থাপনা
- রোগীর সম্পূর্ণ প্রোফাইল তৈরি ও সম্পাদনা
- ইউনিক ফোন নম্বর দিয়ে রোগী সনাক্তকরণ
- রোগীর ইতিহাস ট্র্যাকিং
- উন্নত সার্চ ও ফিল্টারিং
- সিরিয়াল নম্বর ভিত্তিক রোগী ব্যবস্থাপনা

### 📋 কনসালটেশন ব্যবস্থাপনা
- বিস্তারিত কনসালটেশন রেকর্ড
- প্রধান অভিযোগ ও লক্ষণ ট্র্যাকিং
- চিকিৎসা ইতিহাস ও পারিবারিক ইতিহাস
- সাধারণ ও সিস্টেমিক পরীক্ষা
- রোগ নির্ণয় ও চিকিৎসা পরিকল্পনা
- ফলো-আপ ডেট সেটিং
- চেম্বার-ভিত্তিক বিলিং

### 🧘 রোগীর অভ্যাস ট্র্যাকিং
- ডাইনামিক হ্যাবিট কনফিগারেশন
- বুলিয়ান (হ্যাঁ/না) টাইপ
- স্কেল (১-১০) রেটিং
- সিলেক্ট ড্রপডাউন অপশন
- টেক্সট ও নাম্বার ইনপুট ফিল্ড
- কনসালটেশন-ভিত্তিক হ্যাবিট ট্র্যাকিং

### 💊 প্রেসক্রিপশন ব্যবস্থাপনা
- ডিজিটাল প্রেসক্রিপশন তৈরি
- ঔষধের নাম, পোটেন্সি, ডোজ
- চিকিৎসার সময়কাল
- প্রেসক্রিপশন ইতিহাস
- QR কোড সহ প্রিন্ট সুবিধা
- রোগী QR স্ক্যান করে প্রেসক্রিপশন দেখতে পারবেন

### 🏥 চেম্বার ব্যবস্থাপনা
- একাধিক চেম্বার সাপোর্ট
- চেম্বার-ভিত্তিক রিপোর্টিং
- যোগাযোগের তথ্য ও খোলার সময়
- চেম্বার সুইচিং সুবিধা

### 🎤 ভয়েস ইনপুট
- বাংলা ভয়েস রিকগনিশন
- সকল টেক্সট ফিল্ডে ভয়েস ইনপুট
- হাতে লেখার পরিবর্তে কথা বলে ডেটা এন্ট্রি

## 🛠️ ইনস্টলেশন ও সেটআপ

### পূর্বশর্ত
- Node.js 18+ ইনস্টল করা
- Appwrite সার্ভার সেটআপ
- Google OAuth অ্যাপ তৈরি

### ১. প্রোজেক্ট ক্লোন ও ডিপেন্ডেন্সি ইনস্টল

\`\`\`bash
git clone <repository-url>
cd popular-homeo-care
npm install
\`\`\`

### ২. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ

`.env.local` ফাইল তৈরি করুন:

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
NEXT_PUBLIC_COLLECTION_PRESCRIBED_MEDICINES_ID=prescribed-medicines-collection-id
NEXT_PUBLIC_COLLECTION_CHAMBERS_ID=chambers-collection-id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

## 📊 Appwrite ডেটাবেস স্কিমা

### Patients Collection
\`\`\`javascript
{
  $id: string (pk),
  name: string (required),
  gender: string (required), // "Male", "Female", "Other"
  age: integer (required),
  dob: datetime (optional),
  address: string (optional),
  phoneNumber: string (required, unique),
  occupation: string (optional),
  serialNumber: string (required, unique),
  lastVisitDate: datetime (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### Consultations Collection
\`\`\`javascript
{
  $id: string (pk),
  patientId: string (relationship to Patients, required),
  consultationDate: datetime (required),
  time: string (required),
  chiefComplaint: string (required),
  historyOfPresentIllness: string (optional),
  pastMedicalHistory: string (optional),
  familyHistory: string (optional),
  personalHistory: string (optional),
  generalExamination: string (optional),
  systemicExamination: string (optional),
  investigations: string (optional),
  diagnosis: string (required),
  treatmentPlan: string (required),
  advice: string (optional),
  followUpDate: datetime (optional),
  chamberId: string (relationship to Chambers, required),
  doctorId: string (required),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### PatientHabits Collection
\`\`\`javascript
{
  $id: string (pk),
  habitDefinitionId: string (relationship to HabitDefinitions, required),
  patientId: string (relationship to Patients, required),
  consultationId: string (relationship to Consultations, required),
  value: string (required), // Value based on habitType
  notes: string (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### HabitDefinitions Collection
\`\`\`javascript
{
  $id: string (pk),
  name: string (required, unique),
  inputType: string (required), // "text", "number", "select", "boolean", "scale"
  options: string (optional), // JSON string for select options
  description: string (optional),
  isActive: boolean (required, default: true),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### PrescribedMedicines Collection
\`\`\`javascript
{
  $id: string (pk),
  consultationId: string (relationship to Consultations, required),
  medicineName: string (required),
  potency: string (optional),
  dosage: string (required),
  duration: string (optional),
  notes: string (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

### Chambers Collection
\`\`\`javascript
{
  $id: string (pk),
  chamberName: string (required, unique),
  location: string (optional),
  contactNumber: string (optional),
  contactPerson: string (optional),
  openingHours: string (optional),
  notes: string (optional),
  $createdAt: datetime,
  $updatedAt: datetime
}
\`\`\`

## 🔗 ডেটাবেস রিলেশনশিপ

\`\`\`
Patients (1) ←→ (Many) Consultations
Chambers (1) ←→ (Many) Consultations
Patients (1) ←→ (Many) PatientHabits
Consultations (1) ←→ (Many) PatientHabits
Consultations (1) ←→ (Many) PrescribedMedicines
HabitDefinitions (1) ←→ (Many) PatientHabits
\`\`\`

## 🎯 Appwrite কালেকশন সেটআপ গাইড

### ১. ডেটাবেস তৈরি
1. Appwrite কনসোলে লগইন করুন
2. নতুন প্রোজেক্ট তৈরি করুন
3. ডেটাবেস তৈরি করুন

### ২. কালেকশন তৈরি

#### Patients কালেকশন
\`\`\`bash
Collection ID: patients
Attributes:
- name (string, 255, required)
- gender (string, 10, required)
- age (integer, required)
- dob (datetime, optional)
- address (string, 500, optional)
- phoneNumber (string, 15, required, unique)
- occupation (string, 100, optional)
- serialNumber (string, 50, required, unique)
- lastVisitDate (datetime, optional)

Indexes:
- phoneNumber (unique)
- serialNumber (unique)
- name (fulltext)
\`\`\`

#### Consultations কালেকশন
\`\`\`bash
Collection ID: consultations
Attributes:
- patientId (string, 255, required)
- consultationDate (datetime, required)
- time (string, 10, required)
- chiefComplaint (string, 1000, required)
- historyOfPresentIllness (string, 2000, optional)
- pastMedicalHistory (string, 2000, optional)
- familyHistory (string, 1000, optional)
- personalHistory (string, 1000, optional)
- generalExamination (string, 1000, optional)
- systemicExamination (string, 1000, optional)
- investigations (string, 1000, optional)
- diagnosis (string, 1000, required)
- treatmentPlan (string, 2000, required)
- advice (string, 1000, optional)
- followUpDate (datetime, optional)
- chamberId (string, 255, required)
- doctorId (string, 255, required)

Indexes:
- patientId
- consultationDate
- chamberId
- doctorId
\`\`\`

#### PatientHabits কালেকশন
\`\`\`bash
Collection ID: patient_habits
Attributes:
- habitDefinitionId (string, 255, required)
- patientId (string, 255, required)
- consultationId (string, 255, required)
- value (string, 500, required)
- notes (string, 1000, optional)

Indexes:
- habitDefinitionId
- patientId
- consultationId
\`\`\`

#### HabitDefinitions কালেকশন
\`\`\`bash
Collection ID: habit_definitions
Attributes:
- name (string, 100, required, unique)
- inputType (string, 20, required)
- options (string, 1000, optional)
- description (string, 500, optional)
- isActive (boolean, required, default: true)

Indexes:
- name (unique)
- isActive
\`\`\`

#### PrescribedMedicines কালেকশন
\`\`\`bash
Collection ID: prescribed_medicines
Attributes:
- consultationId (string, 255, required)
- medicineName (string, 200, required)
- potency (string, 50, optional)
- dosage (string, 200, required)
- duration (string, 100, optional)
- notes (string, 500, optional)

Indexes:
- consultationId
- medicineName
\`\`\`

#### Chambers কালেকশন
\`\`\`bash
Collection ID: chambers
Attributes:
- chamberName (string, 100, required, unique)
- location (string, 500, optional)
- contactNumber (string, 15, optional)
- contactPerson (string, 100, optional)
- openingHours (string, 200, optional)
- notes (string, 1000, optional)

Indexes:
- chamberName (unique)
\`\`\`

## 🔐 অথেন্টিকেশন সেটআপ

### Google OAuth সেটআপ
1. Google Cloud Console এ যান
2. নতুন প্রোজেক্ট তৈরি করুন
3. OAuth 2.0 credentials তৈরি করুন
4. Authorized redirect URIs যোগ করুন:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

### Appwrite Authentication সেটআপ
1. Appwrite কনসোলে Auth সেকশনে যান
2. Google OAuth প্রোভাইডার এনাবল করুন
3. Google Client ID ও Secret যোগ করুন
4. Redirect URLs কনফিগার করুন

## 🚀 অ্যাপ্লিকেশন চালানো

\`\`\`bash
npm run dev
\`\`\`

অ্যাপ্লিকেশনটি `http://localhost:3000` এ চালু হবে।

## 📁 প্রোজেক্ট স্ট্রাকচার

\`\`\`
popular-homeo-care/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   │   ├── patients/      # Patient management
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
│   ├── forms/            # Form components
│   ├── landing/          # Landing page components
│   ├── common/           # Common components
│   └── kbar/             # Command palette
├── lib/                   # Utilities and configurations
├── services/             # Appwrite service functions
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── constants/            # App constants
└── styles/               # Global styles
\`\`\`

## 🎨 UI/UX বৈশিষ্ট্য

### 🌙 থিম সাপোর্ট
- ডার্ক/লাইট মোড
- সিস্টেম থিম ডিটেকশন
- স্মুথ থিম ট্রানজিশন

### 📱 রেসপন্সিভ ডিজাইন
- মোবাইল-ফার্স্ট অ্যাপ্রোচ
- ট্যাবলেট ও ডেস্কটপ অপ্টিমাইজেশন
- টাচ-ফ্রেন্ডলি ইন্টারফেস

### ⌨️ কীবোর্ড শর্টকাট
- `Ctrl+K` - কমান্ড প্যালেট
- `Ctrl+B` - সাইডবার টগল
- দ্রুত নেভিগেশন

## 🔧 অ্যাডভান্সড ফিচার

### 🎤 ভয়েস ইনপুট
- Web Speech API ব্যবহার
- বাংলা ভাষা সাপোর্ট
- সকল টেক্সট ফিল্ডে উপলব্ধ

### 📊 রিয়েল-টাইম ডেটা
- TanStack Query দিয়ে ক্যাশিং
- অটোমেটিক রিফেচিং
- অপ্টিমিস্টিক আপডেট

### 🖨️ প্রিন্ট ফিচার
- প্রেসক্রিপশন প্রিন্ট
- QR কোড সহ প্রিন্ট
- কাস্টম প্রিন্ট লেআউট

## 🔒 নিরাপত্তা বৈশিষ্ট্য

- Google OAuth দিয়ে নিরাপদ লগইন
- Role-based access control
- ডেটা এনক্রিপশন
- Session management
- CORS protection
- Input validation ও sanitization

## 📈 পারফরমেন্স অপ্টিমাইজেশন

- React Query দিয়ে ডেটা ক্যাশিং
- Lazy loading
- Image optimization
- Code splitting
- Bundle optimization

## 🌐 ব্রাউজার সাপোর্ট

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 সাপোর্ট ও ডকুমেন্টেশন

### 🆘 সাহায্য
- ইন-অ্যাপ হেল্প সেন্টার
- ভিডিও টিউটোরিয়াল
- FAQ সেকশন

### 📧 যোগাযোগ
- ইমেইল: support@popularhomeocare.com
- ফোন: +৮৮০ ১৭১২-৩৪৫৬৭৮

## 📄 লাইসেন্স

এই প্রোজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সপ্রাপ্ত।

---

**Popular Homeo Care** - আধুনিক হোমিওপ্যাথিক ক্লিনিক ব্যবস্থাপনার জন্য একটি সম্পূর্ণ সমাধান।
