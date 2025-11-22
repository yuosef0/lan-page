# إعداد Supabase Storage لرفع الصور

## الخطوات المطلوبة:

### 1. إنشاء Storage Bucket في Supabase

1. افتح لوحة تحكم Supabase الخاصة بمشروعك
2. اذهب إلى **Storage** من القائمة الجانبية
3. اضغط على **New Bucket**
4. أدخل اسم الـ Bucket: `images`
5. اختر **Public bucket** (لجعل الصور متاحة للجميع)
6. اضغط **Create bucket**

### 2. إعداد السياسات (Policies)

بعد إنشاء الـ bucket، نحتاج إلى إضافة سياسات للسماح برفع الصور:

#### سياسة الرفع (Upload Policy):

```sql
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
```

#### سياسة القراءة (Public Read Policy):

```sql
CREATE POLICY "Allow public to read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

#### سياسة التحديث (Update Policy):

```sql
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');
```

#### سياسة الحذف (Delete Policy):

```sql
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### 3. الإعداد من خلال واجهة Supabase:

بدلاً من SQL، يمكنك إعداد السياسات من الواجهة:

1. اذهب إلى **Storage** → اختر bucket `images`
2. اضغط على **Policies**
3. اضغط **New Policy**
4. اختر القالب المناسب أو أنشئ سياسة مخصصة:
   - **Public access**: للسماح لأي شخص بقراءة الصور
   - **Authenticated users**: للسماح للمستخدمين المسجلين برفع وتعديل الصور

### 4. التحقق من الإعداد:

بعد الانتهاء، جرب رفع صورة من لوحة الإدمن:
- اذهب إلى **Services** أو **Team Members**
- اضغط على **Upload Image**
- اختر صورة من جهازك
- يجب أن تظهر رسالة "Image uploaded successfully!"

## ملاحظات هامة:

- حجم الصورة المسموح به: **أقل من 5MB**
- الصيغ المدعومة: **JPG, PNG, GIF, WebP**
- المجلدات التلقائية:
  - `images/services/` - لصور الخدمات
  - `images/team/` - لصور أعضاء الفريق
  - `images/uploads/` - للصور العامة

## الإعدادات البديلة (اختياري):

إذا كنت تريد bucket خاص بدلاً من عام:

1. أنشئ bucket بدون خيار **Public**
2. أضف سياسة للسماح بالوصول المصرح:

```sql
CREATE POLICY "Allow authenticated access to private images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'images');
```

3. للحصول على URL موقع، استخدم signed URLs بدلاً من public URLs

---

لأي مشاكل أو استفسارات، راجع [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
