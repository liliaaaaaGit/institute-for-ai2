institute-for-ai

## Internationalization (i18n)

This application supports German (DE) and English (EN) languages with full localization.

### Language System

- **Default Language**: German (DE)
- **Supported Languages**: German (DE), English (EN)
- **Persistence**: Language preference is stored in localStorage
- **Fallback**: English is used as fallback if a translation key is missing

### Adding New Translation Keys

1. **Add to both languages** in `src/lib/i18n.ts`:
   ```typescript
   export const translations = {
     de: {
       "your.new.key": "German text here",
       // ... existing keys
     },
     en: {
       "your.new.key": "English text here", 
       // ... existing keys
     }
   }
   ```

2. **Use in components**:
   ```typescript
   import { t } from '../lib/i18n';
   
   // Simple usage
   const text = t('your.new.key');
   
   // With variables
   const text = t('welcome.message', { name: 'John' });
   ```

3. **Variable interpolation**:
   - Use `{{variableName}}` in translation strings
   - Pass variables as second parameter to `t()` function

### Language Switcher

The language switcher is located in the top navigation bar and allows users to toggle between German and English. The selection is automatically persisted and applied across all pages.

### Number and Date Formatting

- **Numbers**: Automatically formatted based on current language (German uses comma as decimal separator, English uses dot)
- **Dates**: Formatted according to locale conventions
- **Utilities**: `formatNumber()`, `formatDate()`, `formatDateShort()`

### Email Localization

Email reports are fully localized including:
- Subject lines
- Content sections
- Comparison units and labels
- Action items and recommendations

### Debug Mode

Add `?debug=i18n` to any URL to show the debug panel which displays:
- Current language
- Missing translation keys
- Quick language switching
- Translation statistics

### Development Guidelines

1. **Never hardcode text** - always use translation keys
2. **Test both languages** - ensure all screens work in both DE and EN
3. **Check for missing keys** - use debug mode to identify untranslated content
4. **Consider text length** - German text is typically 20-30% longer than English
5. **Use semantic keys** - prefer `form.submit` over `button.text`

### File Structure

```
src/
├── lib/
│   └── i18n.ts              # Main i18n system and translations
├── components/
│   ├── LanguageSwitcher.tsx # Language toggle component
│   └── DebugPanel.tsx       # Development debug panel
└── emails/
    └── Co2Report.html.ts    # Localized email templates
```