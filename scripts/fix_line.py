with open('src/components/ArticleDetails.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'cleanPara = paragraph.replace(' in line:
        new_lines.append('                const cleanPara = paragraph.replace(/^\\d+\\.\\s*[^:]*?:\\s*/g, "").trim();\n')
    else:
        new_lines.append(line)

with open('src/components/ArticleDetails.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed line successfully!")
