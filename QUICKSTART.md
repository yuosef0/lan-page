# 🚀 Quick Start Guide

## تشغيل المشروع في 5 خطوات

### 1️⃣ إنشاء حساب Supabase (مجاني)
1. افتح https://supabase.com
2. سجل حساب جديد (مجاني 100%)
3. اضغط **New Project**
4. اختر اسم + password للمشروع

### 2️⃣ إنشاء Database
1. اذهب لـ **SQL Editor** في Supabase Dashboard
2. انسخ كل محتويات `supabase/schema.sql`
3. الصقه في SQL Editor واضغط **Run**
4. سيتم إنشاء الجداول + البيانات الأولية تلقائياً ✅

### 3️⃣ تثبيت وتشغيل المشروع
```bash
npm install              # تثبيت المكتبات
cp .env.example .env.local   # إنشاء ملف الإعدادات
npm run dev              # تشغيل المشروع 🚀
```

### 4️⃣ ربط Supabase بالمشروع
1. اذهب لـ **Settings > API** في Supabase
2. انسخ `Project URL` و `anon public key`
3. افتح `.env.local` والصقهم:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5️⃣ إنشاء Admin User
1. اذهب لـ **Authentication** في Supabase Dashboard
2. اضغط **Add User**
3. Email: `admin@apexbase.com`
4. Password: `Admin123!` (أو أي password تريده)
5. اضغط **Create User** ✅

الآن يمكنك:
- ✅ فتح الموقع: http://localhost:3000
- ✅ تسجيل دخول Admin: http://localhost:3000/admin/login
- ✅ تعديل كل المحتوى من لوحة التحكم

---

## 📱 الروابط المهمة

| الصفحة | الرابط |
|--------|--------|
| 🏠 الموقع | http://localhost:3000 |
| 🔐 لوحة التحكم | http://localhost:3000/admin/login |
| 📊 Dashboard | http://localhost:3000/admin/dashboard |
| 🔌 Backend API | http://localhost:5000/api |

---

## ⚡ أوامر سريعة

### Backend
```bash
npm run dev      # تشغيل الخادم
npm run seed     # إعادة تحميل البيانات الأولية
```

### Frontend
```bash
npm run dev      # تشغيل الموقع
npm run build    # بناء للإنتاج
```

---

## 🎨 تخصيص اللون الأساسي

عدّل ملف `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#A52A2A',  // غيّر هذا اللون
}
```

---

## 📝 إضافة محتوى جديد

### عبر لوحة التحكم (موصى به)
1. سجل دخول على `/admin/login`
2. اذهب للصفحة المطلوبة
3. اضغط على الأزرار للتعديل

### عبر API مباشرة
استخدم Postman أو curl:

```bash
# مثال: إضافة service جديد
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Service",
    "description": "Description here",
    "image": "https://example.com/image.jpg",
    "imagePosition": "left",
    "order": 1
  }'
```

---

## 🆘 مشاكل شائعة

### ❌ Backend لا يعمل
- تأكد من تشغيل MongoDB
- تحقق من ملف `.env`
- جرّب `npm run seed` مرة أخرى

### ❌ Frontend لا يتصل بالـ Backend
- تأكد من `.env.local` يحتوي على `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- تأكد من أن Backend شغال على port 5000

### ❌ لا أستطيع تسجيل الدخول
- استخدم البيانات الافتراضية: `admin@apexbase.com` / `Admin123!`
- جرّب `npm run seed` في Backend لإعادة إنشاء المستخدم

---

## 📚 المزيد من المعلومات

اقرأ ملف `README.md` للحصول على:
- توثيق API كامل
- تفاصيل البنية
- معلومات الـ deployment
- خيارات التخصيص

---

**بالتوفيق! 🎉**
