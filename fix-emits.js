const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

const files = glob.sync(['src/**/*.vue'], { absolute: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Find all emitted events
  const emitRegex = /(?:\$emit\(this,\s*|emit\()(['"`])(.*?)\1/g;
  let match;
  const events = new Set();
  while ((match = emitRegex.exec(content)) !== null) {
    events.add(match[2]);
  }

  if (events.size > 0) {
    // Check if defineEmits exists
    const defineEmitsRegex = /const emit\s*=\s*defineEmits\((.*?)\)/s;
    const defineEmitsMatch = defineEmitsRegex.exec(content);

    if (defineEmitsMatch) {
      let currentEmits = [];
      try {
        // Simple extraction of current emits if it's an array
        const arrMatch = /\[(.*?)\]/s.exec(defineEmitsMatch[1]);
        if (arrMatch) {
          const items = arrMatch[1].split(',').map(s => s.trim().replace(/['"`]/g, '')).filter(Boolean);
          items.forEach(i => events.add(i));
        }
      } catch (e) {}

      const newEmitsStr = "['" + Array.from(events).join("', '") + "']";
      const newDefineEmits = `const emit = defineEmits(${newEmitsStr})`;
      content = content.replace(defineEmitsRegex, newDefineEmits);
      changed = true;
    } else {
      // Add defineEmits if it doesn't exist
      const newEmitsStr = "['" + Array.from(events).join("', '") + "']";
      const newDefineEmits = `const emit = defineEmits(${newEmitsStr})`;
      content = content.replace(/<script setup>[\r\n]+/, `<script setup>\n${newDefineEmits}\n`);
      changed = true;
    }
  }

  // Replace $emit(this, ...) with emit(...)
  if (content.includes('$emit(this,')) {
    content = content.replace(/\$emit\(this,\s*/g, 'emit(');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
