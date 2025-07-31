my-homeopathy-clinic-app/
├── .env.local             # 🔑 এনভায়রনমেন্ট ভেরিয়েবল (Appwrite credentials)
├── .eslintrc.json         # 📜 ESLint কনফিগারেশন (কোড লিন্টিং)
├── .prettierrc.json       # 💅 Prettier কনফিগারেশন (কোড ফরম্যাটিং)
├── components.json        # 🎨 Shadcn/ui কনফিগারেশন ফাইল
├── next.config.mjs        # ⚙️ Next.js কনফিগারেশন
├── package.json           # 📦 প্রোজেক্ট ডিপেন্ডেন্সি এবং স্ক্রিপ্ট
├── postcss.config.js      # 🎨 PostCSS কনফিগারেশন (Tailwind CSS এর জন্য)
├── public/                # 🖼️ স্ট্যাটিক অ্যাসেটস (ইমেজ, ফ্যাভিকন)
│   └── favicon.ico
├── app/                   # 🚀 Next.js App Router রুট ডিরেক্টরি
│   ├── (auth)/            # 🔒 অথেন্টিকেশন ফ্লোর জন্য রাউট গ্রুপ (যেমন: login, register)
│   │   ├── login/
│   │   │   └── page.jsx
│   │   └── register/
│   │       └── page.jsx
│   ├── dashboard/         # 📊 অথেন্টিকেটেড ব্যবহারকারীদের জন্য মূল অ্যাপ্লিকেশন রাউট
│   │   ├── patients/      # 🧑‍⚕️ রোগী তালিকা এবং বিস্তারিত তথ্য
│   │   │   ├── [patientId]/ # রোগীর আইডি দিয়ে ডাইনামিক রাউট
│   │   │   │   ├── edit/page.jsx   # রোগীর তথ্য এডিট
│   │   │   │   ├── consultations/ # নির্দিষ্ট রোগীর কনসালটেশন
│   │   │   │   │   ├── [consultationId]/ # কনসালটেশন আইডি দিয়ে ডাইনামিক রাউট
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── new/page.jsx   # নতুন কনসালটেশন যোগ
│   │   │   │   └── page.jsx      # রোগীর বিস্তারিত ওভারভিউ
│   │   │   ├── new/page.jsx   # নতুন রোগী যোগ করার ফর্ম
│   │   │   └── page.jsx       # সমস্ত রোগীর তালিকা
│   │   ├── chambers/      # 🏥 চেম্বার ম্যানেজমেন্ট
│   │   │   └── page.jsx
│   │   ├── diseases/      # 🤒 রোগের মাস্টার তালিকা ম্যানেজমেন্ট
│   │   │   └── page.jsx
│   │   ├── settings/      # ⚙️ অ্যাপ্লিকেশন সেটিংস
│   │   │   └── page.jsx
│   │   └── page.jsx           # ড্যাশবোর্ডের হোম পেজ
│   ├── api/                   # 🌐 Next.js API Routes (যদি সার্ভার অ্যাকশন ব্যবহার না হয়)
│   │   └── webhooks/
│   │       └── appwrite.js    # উদাহরণ: Appwrite ওয়েবহুক হ্যান্ডলার
│   ├── layout.jsx             # 🎨 রুটের লেআউট (যেমন: AuthProvider, QueryClientProvider)
│   ├── page.jsx               # 🏠 পাবলিক হোম পেজ / ল্যান্ডিং পেজ
│   └── global-error.jsx       # ⚠️ গ্লোবাল এরর বাউন্ডারি
├── components/            # 📦 পুনরায় ব্যবহারযোগ্য React কম্পোনেন্টস
│   ├── ui/                # 🎨 Shadcn/ui কম্পোনেন্টস (যেমন: Button, Input, Form)
│   │   ├── button.jsx
│   │   ├── form.jsx
│   │   ├── input.jsx
│   │   └── ...
│   ├── layout/            # 🏗️ লেআউট-নির্দিষ্ট কম্পোনেন্টস (যেমন: সাইডবার, হেডার)
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   ├── forms/             # 📝 জটিল, ডোমেইন-নির্দিষ্ট ফর্ম কম্পোনেন্টস
│   │   ├── PatientForm.jsx
│   │   ├── ConsultationForm.jsx
│   │   └── HabitForm.jsx
│   ├── common/            # 💡 সাধারণ UI কম্পোনেন্টস (যেমন: LoadingSpinner, EmptyState)
│   │   └── LoadingSpinner.jsx
│   └── auth/              # 🔐 অথেন্টিকেশন-সম্পর্কিত UI কম্পোনেন্টস
│       └── AuthChecker.jsx
├── config/                # 🛠️ গ্লোবাল অ্যাপ্লিকেশন কনফিগারেশন
│   └── site.js            # সাইট মেটাডেটা, নেভিগেশন লিঙ্ক ইত্যাদি
├── lib/                   # 📚 সাধারণ ইউটিলিটি ফাংশন, প্রোভাইডার, কাস্টম হুকস
│   ├── appwrite.js        # Appwrite SDK ইনিশিয়ালাইজেশন (ক্লায়েন্ট-সাইড)
│   ├── utils.js           # সাধারণ সহায়ক ফাংশন
│   ├── hooks/             # কাস্টম React হুকস (যেমন: useAuth, usePatientData)
│   │   ├── useAuth.js
│   │   └── usePatientData.js # React Query-ভিত্তিক ডেটা ফেচিং হুকস
│   └── providers/         # 🤝 Context প্রোভাইডার্স (যেমন: React Query Provider, Auth Provider)
│       ├── ReactQueryProvider.jsx
│       └── AuthProvider.jsx
├── services/              # 🌐 Appwrite এর সাথে ডেটা ইন্টারঅ্যাকশন লজিক
│   ├── auth.js            # Appwrite Account/Auth সম্পর্কিত ফাংশন
│   ├── patients.js        # Patients কালেকশনের জন্য CRUD অপারেশন
│   ├── consultations.js   # Consultations কালেকশনের জন্য CRUD অপারেশন
│   ├── habits.js          # PatientHabits কালেকশনের জন্য CRUD অপারেশন
│   ├── chambers.js        # Chambers কালেকশনের জন্য CRUD অপারেশন
│   └── diseases.js        # Diseases কালেকশনের জন্য CRUD অপারেশন
├── styles/                # 🎨 গ্লোবাল স্টাইল এবং Tailwind CSS সেটআপ
│   ├── globals.css
│   └── tailwind.config.js
├── server/                # ☁️ সার্ভার-অনলি ইউটিলিটি বা জটিল সার্ভার অ্যাকশন
│   └── appwrite-server.js # Appwrite SDK ইনিশিয়ালাইজেশন (সার্ভার-সাইড, API Key সহ)
│   └── actions/           # Next.js সার্ভার অ্যাকশনস (ডেটাবেস মিউটেশনের জন্য)
│       ├── patient-actions.js
│       └── consultation-actions.js
├── jsconfig.json          # 📝 JavaScript কনফিগারেশন (VS Code এর মতো এডিটরের জন্য)
└── README.md              # 📄 প্রোজেক্টের ডকুমেন্টেশন ফাইল (এই ফাইলটি)

{
  "patientDetails": {
    "name": "রোগীর নাম",
    "age": 30,
    "dob": "1995-01-15T00:00:00.000Z",
    "gender": "Male",
    "phoneNumber": "01XXXXXXXXX",
    "address": "গ্রাম, জেলা",
    "occupation": null,
    "serialNumber": "P001",
    "bloodGroup": null,
    "notes": null,
    "firstConsultationDate": "2025-07-31T08:00:00.000Z"
  },
  "consultationDetails": {
    "consultationDate": "2025-07-31T08:00:00.000Z",
    "chamberId": "chamber_id_123",
    "patientId": "auto_generated_patient_id",
    "chiefComplaint": ["মাথাব্যথা", "জ্বর"],
    "symptoms": "শীতলতা, দুর্বলতা",
    "BP": "120/80",
    "Pulse": "72",
    "Temp": "99.5F",
    "historyOfPresentIllness": "২ দিন ধরে",
    "familyHistory": null,
    "otherComplaints": [],
    "diagnosis": ["সাধারণ ফ্লু"],
    "O_E": "কিছু পরীক্ষা",
    "prescriptions": ["medicine_id_abc", "medicine_id_def"],
    "prescriptionNotes": "খাবার আগে",
    "dosageInstructions": ["দিনে তিনবার", "খাওয়ার পর"],
    "dietAndLifestyleAdvice": ["পুষ্টিকর খাবার"],
    "followUpDate": null,
    "billAmount": 500,
    "notes": "পরবর্তী ফলোআপ গুরুত্বপূর্ণ"
  },
  "patientHabits": [
    {
      "habitDefinitionId": "habit_id_xyz",
      "value": "ধূমপান",
      "patientId": "auto_generated_patient_id",
      "consultationId": "auto_generated_consultation_id",
      "notes": "দিনে ৫টি",
      "recordedDate": "2025-07-31T14:09:19.000Z"
    }
  ]
}