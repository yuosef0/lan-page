# 🚀 Quick Start Guide

## تشغيل المشروع في 5 خطوات

### 1️⃣ تثبيت MongoDB
تأكد من تشغيل MongoDB على جهازك أو استخدم MongoDB Atlas (cloud)

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed    # يُنشئ البيانات الأولية + حساب الأدمن
npm run dev     # سيعمل على http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev     # سيعمل على http://localhost:3000
```

### 4️⃣ تسجيل الدخول للوحة التحكم
- افتح: http://localhost:3000/admin/login
- **Email**: `admin@apexbase.com`
- **Password**: `Admin123!`

### 5️⃣ ابدأ التعديل!
الآن يمكنك:
- ✅ تعديل محتوى الصفحات من لوحة التحكم
- ✅ إضافة/حذف/تعديل Services
- ✅ إدارة Team Members
- ✅ تغيير معلومات الاتصال
- ✅ مشاهدة رسائل Contact Forms

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
