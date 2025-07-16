# 🏥 হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম

একটি আধুনিক, পেশাদার হোমিওপ্যাথিক ক্লিনিক ম্যানেজমেন্ট সিস্টেম যা ডাক্তারদের রোগী, কনসালটেশন, প্রেসক্রিপশন এবং ক্লিনিক ডেটা দক্ষতার সাথে পরিচালনা করতে সাহায্য করে।

## 🚀 প্রযুক্তিগত স্ট্যাক

- **ফ্রন্টএন্ড:** Next.js 14 (App Router), React 18, JSX
- **UI লাইব্রেরি:** Shadcn/ui, Tailwind CSS
- **ডেটা ফেচিং:** React Query (TanStack Query)
- **ব্যাকএন্ড:** Appwrite (BaaS)
- **অথেন্টিকেশন:** Google OAuth (Appwrite Auth)
- **স্টেট ম্যানেজমেন্ট:** React Query + Context API
- **অ্যানিমেশন:** Framer Motion, Tailwind CSS Animations

## 📋 মূল বৈশিষ্ট্যসমূহ

### 🧑‍⚕️ রোগী ব্যবস্থাপনা
- রোগীর সম্পূর্ণ প্রোফাইল তৈরি ও সম্পাদনা
- ইউনিক ফোন নম্বর দিয়ে রোগী সনাক্তকরণ
- রোগীর ইতিহাস ট্র্যাকিং
- উন্নত সার্চ ও ফিল্টারিং

### 📋 কনসালটেশন ব্যবস্থাপনা
- একাধিক কনসালটেশন রেকর্ড
- প্রধান অভিযোগ ও লক্ষণ ট্র্যাকিং
- ভাইটাল সাইন রেকর্ডিং (BP, Pulse, Temp)
- ফলো-আপ ডেট সেটিং
- চেম্বার-ভিত্তিক বিলিং

### 🧘 রোগীর অভ্যাস ট্র্যাকিং
- ডাইনামিক হ্যাবিট কনফিগারেশন
- বুলিয়ান (হ্যাঁ/না) টাইপ
- লো/মিড/হাই স্কেল
- টেক্সট ইনপুট ফিল্ড
- কনসালটেশন-ভিত্তিক হ্যাবিট ট্র্যাকিং

### 💊 প্রেসক্রিপশন ব্যবস্থাপনা
- ঔষধের নাম, পোটেন্সি, ডোজ
- চিকিৎসার সময়কাল
- প্রেসক্রিপশন ইতিহাস
- ডেট-ভিত্তিক ট্র্যাকিং

### 🏥 চেম্বার ব্যবস্থাপনা
- একাধিক চেম্বার সাপোর্ট
- চেম্বার-ভিত্তিক রিপোর্টিং
- যোগাযোগের তথ্য

### 🤒 রোগ ব্যবস্থাপনা
- রোগের মাস্টার তালিকা
- রোগের বিবরণ ও নোট

## 🛠️ ইনস্টলেশন ও সেটআপ

### পূর্বশর্ত
- Node.js 18+ ইনস্টল করা
- Appwrite সার্ভার সেটআপ
- Google OAuth অ্যাপ তৈরি

### ১. প্রোজেক্ট ক্লোন ও ডিপেন্ডেন্সি ইনস্টল

\`\`\`bash
git clone <repository-url>
cd homeopathic-clinic-system
npm install
\`\`\`

### ২. এনভায়রনমেন্ট ভেরিয়েবল সেটআপ

\`.env.local\` ফাইল তৈরি করুন:

\`\`\`env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id

# Collection IDs
NEXT_PUBLIC_COLLECTION_PATIENTS_ID=patients-collection-id
NEXT_PUBLIC_COLLECTION_CONSULTATIONS_ID=consultations-collection-id
NEXT_PUBLIC_COLLECTION_PATIENT_HABITS_ID=patient-habits-collection-id
NEXT_PUBLIC_COLLECTION_DISEASES_ID=diseases-collection-id
NEXT_PUBLIC_COLLECTION_PRESCRIBED_MEDICINES_ID=prescribed-medicines-collection-id
NEXT_PUBLIC_COLLECTION_CHAMBERS_ID=chambers-collection-id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

### ৩. Appwrite ডেটাবেস সেটআপ

#### ডেটাবেস তৈরি
1. Appwrite কনসোলে লগইন করুন
2. নতুন প্রোজেক্ট তৈরি করুন
3. ডেটাবেস তৈরি করুন

#### কালেকশন তৈরি

##### Patients কালেকশন
\`\`\`javascript
// Attributes
- name (string, required)
- gender (string, required) // "পুরুষ", "মহিলা", "অন্যান্য"
- age (integer, required)
- dob (datetime, optional)
- address (string, optional)
- phoneNumber (string, required, unique)
- occupation (string, optional)
- lastVisitDate (datetime, optional)
\`\`\`

##### Consultations কালেকশন
\`\`\`javascript
// Attributes
- patientId (relationship to Patients, required)
- consultationDate (datetime, required)
- chiefComplaint (string array, required)
- chiefComplaintNotes (string, optional)
- symptoms (string, optional)
- O_E (string, optional) // On Examination
- BP (string, optional) // Blood Pressure
- Pulse (string, optional)
- Temp (string, optional) // Temperature
- investigation (string array, optional)
- chamberId (relationship to Chambers, required)
- diagnosis (string, optional)
- notes (string, optional)
- followUpDate (datetime, optional)
- billAmount (float, required)
\`\`\`

##### PatientHabits কালেকশন
\`\`\`javascript
// Attributes
- patientId (relationship to Patients, required)
- consultationId (relationship to Consultations, required)
- habitName (string, required)
- habitType (string, required) // "boolean", "low_mid_high", "text_input"
- habitValue (string, required)
- notes (string, optional)
\`\`\`

##### Diseases কালেকশন
\`\`\`javascript
// Attributes
- diseaseName (string, required, unique)
- description (string, optional)
\`\`\`

##### PrescribedMedicines কালেকশন
\`\`\`javascript
// Attributes
- consultationId (relationship to Consultations, required)
- medicineName (string, required)
- potency (string, optional)
- dosage (string, required)
- duration (string, optional)
- notes (string, optional)
\`\`\`

##### Chambers কালেকশন
\`\`\`javascript
// Attributes
- chamberName (string, required, unique)
- address (string, optional)
- contactNumber (string, optional)
\`\`\`

### ৪. Google OAuth সেটআপ

1. Google Cloud Console এ যান
2. নতুন প্রোজেক্ট তৈরি করুন
3. OAuth 2.0 credentials তৈরি করুন
4. Authorized redirect URIs যোগ করুন:
   - \`http://localhost:3000/auth/callback\`
   - \`https://your-domain.com/auth/callback\`

### ৫. Appwrite Authentication সেটআপ

1. Appwrite কনসোলে Auth সেকশনে যান
2. Google OAuth প্রোভাইডার এনাবল করুন
3. Google Client ID ও Secret যোগ করুন
4. Redirect URLs কনফিগার করুন

### ৬. অ্যাপ্লিকেশন চালানো

\`\`\`bash
npm run dev
\`\`\`

অ্যাপ্লিকেশনটি \`http://localhost:3000\` এ চালু হবে।

## 📁 প্রোজেক্ট স্ট্রাকচার

\`\`\`
homeopathic-clinic-system/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   ├── api/               # API routes
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Landing page
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── common/           # Common components
├── lib/                   # Utilities and configurations
├── services/             # Appwrite service functions
├── hooks/                # Custom React hooks
├── providers/            # Context providers
└── styles/               # Global styles
\`\`\`

## 🔐 নিরাপত্তা বৈশিষ্ট্য

- Google OAuth দিয়ে নিরাপদ লগইন
- Role-based access control
- ডেটা এনক্রিপশন
- Session management
- CORS protection

## 📱 রেসপন্সিভ ডিজাইন

- মোবাইল-ফার্স্ট অ্যাপ্রোচ
- ট্যাবলেট ও ডেস্কটপ অপ্টিমাইজেশন
- টাচ-ফ্রেন্ডলি ইন্টারফেস

## 🎨 UI/UX বৈশিষ্ট্য

- ডার্ক/লাইট মোড সাপোর্ট
- স্মুথ অ্যানিমেশন
- ইন্টুইটিভ নেভিগেশন
- প্রফেশনাল ডিজাইন

## 🚀 পারফরমেন্স অপ্টিমাইজেশন

- React Query দিয়ে ডেটা ক্যাশিং
- Lazy loading
- Image optimization
- Code splitting

## 📊 রিপোর্টিং ও অ্যানালিটিক্স

- রোগীর ভিজিট ট্র্যাকিং
- চেম্বার-ভিত্তিক রিপোর্ট
- আয়ের হিসাব
- ট্রেন্ড অ্যানালিসিস

## 🔄 ডেটা ব্যাকআপ ও রিস্টোর

- Appwrite এর বিল্ট-ইন ব্যাকআপ
- ডেটা এক্সপোর্ট/ইম্পোর্ট
- ক্লাউড সিঙ্ক

## 🛠️ ডেভেলপমেন্ট

### কোড কোয়ালিটি
- ESLint কনফিগারেশন
- Prettier ফরম্যাটিং
- Pre-commit hooks

### টেস্টিং
- Unit tests
- Integration tests
- E2E testing

## 📞 সাপোর্ট

প্রযুক্তিগত সহায়তার জন্য ডকুমেন্টেশন দেখুন অথবা ইস্যু ট্র্যাকারে রিপোর্ট করুন।

## 📄 লাইসেন্স

এই প্রোজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সপ্রাপ্ত।
