const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');

const replacements = [
  {
    from: /@import\s+['"]@\/styles\/variables\.scss['"];/g,
    to: "@use '@/styles/variables.scss' as *;"
  },
  {
    from: /@import\s+['"]\.\/variables\.scss['"];/g,
    to: "@use './variables.scss' as *;"
  },
  {
    from: /@import\s+['"]\.\/vant-theme\.scss['"];/g,
    to: "@use './vant-theme.scss' as *;"
  },
  {
    from: /@import\s+['"]\.\/reset\.scss['"];/g,
    to: "@use './reset.scss' as *;"
  }
];

async function runMigration() {
  const files = await fg(['src/**/*.{vue,scss}'], { dot: true });
  
  console.log(`共发现 ${files.length} 个待检查文件。`);
  
  let updatedFilesCount = 0;

  for (const file of files) {
    const fullPath = path.resolve(process.cwd(), file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let isModified = false;

    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        isModified = true;
      }
    });

    if (isModified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`已更新: ${file}`);
      updatedFilesCount++;
    }
  }

  console.log(`\n迁移完成！共修改文件数: ${updatedFilesCount}`);
}

runMigration().catch(err => {
  console.error('执行失败:', err);
});