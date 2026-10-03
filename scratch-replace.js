const fs = require('fs');
const path = require('path');

const targetDir = 'e:\\Coding\\next-js\\crm-student-portal\\app\\(dashboard)\\teacher';
const formDir = 'e:\\Coding\\next-js\\crm-student-portal\\components\\forms';

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const regex = /<Button\s+asChild([^>]*)>\s*(<Link[^>]*>|<a[^>]*>)([\s\S]*?)(<\/Link>|<\/a>)\s*<\/Button>/gi;
            
            content = content.replace(regex, (match, btnProps, linkOpen, inner, linkClose) => {
                modified = true;
                
                let size = "default";
                let variant = "default";
                let className = "";
                
                const sizeMatch = btnProps.match(/size="([^"]*)"/);
                if (sizeMatch) size = sizeMatch[1];
                
                const variantMatch = btnProps.match(/variant="([^"]*)"/);
                if (variantMatch) variant = variantMatch[1];
                
                const classMatch = btnProps.match(/className="([^"]*)"/);
                if (classMatch) className = classMatch[1];
                
                let combinedClass = `cn(buttonVariants({ variant: "${variant}", size: "${size}" })`;
                if (className) combinedClass += `, "${className}"`;
                combinedClass += `)`;

                // Insert className into the linkOpen tag
                let newLinkOpen = linkOpen.replace(/ className="[^"]*"/, '');
                if (newLinkOpen.includes('className={')) {
                    // This is complex, just append to className=
                    // Actually, let's just append className
                }
                
                if (newLinkOpen.endsWith('>')) {
                    newLinkOpen = newLinkOpen.slice(0, -1) + ` className={${combinedClass}}>`;
                }

                return `${newLinkOpen}${inner}${linkClose}`;
            });

            if (modified) {
                if (!content.includes('buttonVariants')) {
                    content = content.replace(/import { Button } from ["']@\/components\/ui\/button["'];?/, 'import { Button, buttonVariants } from "@/components/ui/button";');
                }
                if (!content.includes('import { cn }')) {
                    content = 'import { cn } from "@/lib/utils";\n' + content;
                }
                
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    }
}

processDir(targetDir);
processDir(formDir);
console.log('Done');
