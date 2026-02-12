// ملف الاتصال
import {PrismaClient} from '@prisma/client';

// هذا الكود بيعمل حركة ذكية اسمها Singleton (يعني: الوحيد).
// احنا بنجيب "صندوق" اسمه global (هذا الصندوق بيضل موجود حتى لو الملف عاد تشغيل نفسه).
const globalForPrisma = global;
// هل في موظف (prisma) موجود من قبل؟
// إذا أه: استخدمه هو نفسه (لا توظف جديد). ✅
// إذا لأ: (أول مرة بس) وظف واحد جديد
const prisma = globalForPrisma.prisma ||  new PrismaClient({
    log: process.env.NODE_ENV === "development"? ["query","error","warn"]:["error"]
})

if (process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma = prisma;
}
const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected via prisma");
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect()
}

export {prisma , connectDB , disconnectDB}