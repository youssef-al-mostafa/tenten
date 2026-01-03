# Page Template System

## How It Works

The home page and other dynamic pages are built using a template system that reads configuration from JSON files and stores them in the database. The Filament admin panel generates forms dynamically based on these templates.

## Key Files

### Template Definitions
- `app/Templates/Layouts/home.json` - Home page template
- `app/Templates/Layouts/help.json` - Help page template
- `app/Templates/Layouts/product-details.json` - Product details template

### Services
- `app/Services/TemplateService.php` - Loads templates from JSON files
- `app/Services/TemplateSyncService.php` - Syncs templates to database
- `app/Services/FilamentFormBuilderService.php` - Builds admin forms from templates

### Controllers & Resources
- `app/Http/Controllers/PageController.php` - Handles frontend page rendering
- `app/Filament/Resources/PagesResource.php` - Admin panel pages management

### Frontend
- `resources/js/Pages/Home.tsx` - Home page component
- `resources/js/Components/Core/PageRender.tsx` - Renders sections dynamically

## Making Changes

### 1. Edit the Template JSON

Example: Making a field optional in `app/Templates/Layouts/home.json`

```json
"featured_categories": {
    "title": {
        "type": "string",
        "required": true
    },
    "bottom_text": {
        "type": "text"
    }
}
```

If `"required": true` is missing, the field is optional.

### 2. Sync to Database

After editing any JSON template file, run:

```bash
php artisan pages:sync-templates
```

This updates the `template_schema` column in the `pages` table.

### 3. Clear Cache & Refresh

```bash
php artisan config:clear
php artisan cache:clear
```

Then hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R) in the Filament admin panel.

## Field Types

```json
{
    "field_name": {
        "type": "string",           // Text input
        "type": "text",             // Textarea
        "type": "number",           // Numeric input
        "type": "image",            // Image upload
        "type": "repeater",         // Repeating fields
        "required": true,           // Makes field required
        "default": "value",         // Default value
        "max_length": 100,          // Max characters
        "min": 1,                   // Min value (numbers)
        "max": 5                    // Max value (numbers)
    }
}
```

## Common Tasks

### Add a new section to home page

1. Edit `app/Templates/Layouts/home.json`
2. Add section to `sections` array
3. Define fields under `fields`
4. Run `php artisan pages:sync-templates`
5. Refresh browser

### Make a field optional

Remove `"required": true` from the field definition.

### Add a repeater field

```json
"items": {
    "type": "repeater",
    "fields": {
        "name": {
            "type": "string",
            "required": true
        }
    },
    "min_items": 1,
    "max_items": 10
}
```

## Troubleshooting

**Field still shows as required after sync:**
- Hard refresh browser (Ctrl+Shift+R)
- Run `php artisan optimize:clear`
- Close and reopen admin panel

**Changes not appearing:**
- Check you ran `pages:sync-templates` not `pages:sync`
- Verify JSON syntax is valid
- Check database `pages` table has updated `template_schema`

**Form not showing new fields:**
- The form only appears when editing an existing page
- Template must be synced to database first
- Livewire cache might need clearing (refresh browser)

## Data Flow

1. JSON file defines structure
2. Sync command stores in database `pages.template_schema`
3. Filament reads `template_schema` to build forms
4. Content saved to `pages.content` as JSON
5. Frontend reads merged `template_schema` + `content`
