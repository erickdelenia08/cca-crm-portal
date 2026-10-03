const fs = require('fs');

const filesToFix = [
    'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher\\classes\\[classId]\\layout.tsx',
    'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher\\classes\\[classId]\\sessions\\[sessionId]\\request-change\\page.tsx',
    'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher\\classes\\[classId]\\sessions\\page.tsx',
    'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher\\classes\\[classId]\\students\\[studentId]\\page.tsx',
    'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher\\classes\\[classId]\\students\\page.tsx',
    'e:\\Coding\\next-js\\crm-student-portal\\components\\forms\\teacher-attendance-form.tsx'
];

for (const file of filesToFix) {
    if (!fs.existsSync(file)) {
        console.log("Not found:", file);
        continue;
    }
    let content = fs.readFileSync(file, 'utf8');

    // Fix layout.tsx params
    if (file.includes('layout.tsx')) {
        content = content.replace(/params\.classId/g, 'resolvedParams.classId');
    }

    // Fix missing buttonVariants import
    if (file.includes('page.tsx') && !content.includes('buttonVariants }')) {
        content = content.replace(/import { Button } from ["']@\/components\/ui\/button["'];?/, 'import { Button, buttonVariants } from "@/components/ui/button";');
        // fallback if Button import wasn't found
        if (!content.includes('buttonVariants }')) {
            content = 'import { buttonVariants } from "@/components/ui/button";\n' + content;
        }
    }

    // Fix teacher-attendance-form.tsx
    if (file.includes('teacher-attendance-form.tsx')) {
        content = content.replace(/\(val: string\) => handleStatusChange\(enrollment\.clientId, val as Status\)/, '(val: string | null) => { if(val) handleStatusChange(enrollment.clientId, val as Status) }');
    }

    fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed everything');
