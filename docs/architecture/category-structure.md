# Product Category Architecture

## Hierarchical Structure

The system implements a multi-level hierarchical structure for organizing products:

1. **Departments** (top level)
   - Example: Electronics, Clothing, Home & Garden

2. **Categories** (mid level)
   - Example: Under "Electronics": Smartphones, Laptops, Audio

3. **Subcategories** (leaf level)
   - Example: Under "Smartphones": Android Phones, iPhones

## Database Implementation

The category structure uses a self-referential relationship with nullable parent_id:

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->foreignId('department_id')->constrained();
    $table->foreignId('parent_id')->nullable()->constrained('categories');
    $table->timestamps();
});
```

## Entity Relationships

- **Departments** have many Categories
- **Categories** can have a parent Category
- **Categories** can have many child Categories
- **Products** belong to the most specific (leaf) Category

## Efficient Querying

For efficient hierarchical data retrieval, the system implements the Nested Set Model pattern using the `kalnoy/nestedset` package:

```php
use Kalnoy\Nestedset\NodeTrait;

class Category extends Model
{
    use NodeTrait;
    
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
```

## Admin Interface Restrictions

- **Vendors** cannot edit department or category structure
- **Vendors** can only assign their products to existing categories
- **Admins** and **Master Admins** have full access to manage the category hierarchy

## Query Optimization

To optimize category tree access, the system implements:

1. Eager loading of relationships
2. Caching of category trees
3. Database indexing on frequently queried columns

## Frontend Navigation

The hierarchical structure drives the main navigation system:

- Department-level navigation in main menu
- Category and subcategory navigation in sidebar/filters
- Breadcrumb navigation showing full path
