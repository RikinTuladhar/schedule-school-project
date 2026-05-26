<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    const CREATED_AT = 'date_added';
    const UPDATED_AT = 'date_modified';

    protected $fillable = [
        'master_id',
        'model',
        'sku',
        'upc',
        'ean',
        'jan',
        'isbn',
        'mpn',
        'location',
        'variant',
        'override',
        'quantity',
        'stock_status_id',
        'image',
        'manufacturer_id',
        'shipping',
        'price',
        'points',
        'tax_class_id',
        'date_available',
        'weight',
        'weight_class_id',
        'length',
        'width',
        'height',
        'length_class_id',
        'subtract',
        'minimum',
        'rating',
        'sort_order',
        'status',
        'lookbook_id',
    ];

    protected $casts = [
        'master_id' => 'integer',
        'quantity' => 'integer',
        'stock_status_id' => 'integer',
        'manufacturer_id' => 'integer',
        'shipping' => 'boolean',
        'price' => 'decimal:4',
        'points' => 'integer',
        'tax_class_id' => 'integer',
        'date_available' => 'date',
        'weight' => 'decimal:8',
        'weight_class_id' => 'integer',
        'length' => 'decimal:8',
        'width' => 'decimal:8',
        'height' => 'decimal:8',
        'length_class_id' => 'integer',
        'subtract' => 'boolean',
        'minimum' => 'integer',
        'rating' => 'integer',
        'sort_order' => 'integer',
        'status' => 'boolean',
        'lookbook_id' => 'integer',
    ];

    // Relationships
    public function descriptions()
    {
        return $this->hasMany(ProductDescription::class, 'product_id', 'product_id');
    }

    public function description($languageId = 1)
    {
        return $this->hasOne(ProductDescription::class, 'product_id', 'product_id')
            ->where('language_id', $languageId);
    }

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'product_to_categories',
            'product_id',
            'category_id',
            'product_id',
            'category_id'
        );
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'product_id')
            ->orderBy('sort_order');
    }

    public function discounts()
    {
        return $this->hasMany(ProductDiscount::class, 'product_id', 'product_id');
    }

    public function options()
    {
        return $this->hasMany(ProductOption::class, 'product_id', 'product_id');
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'product_id');
    }

    public function relatedProducts()
    {
        return $this->belongsToMany(
            Product::class,
            'product_relateds',
            'product_id',
            'related_id',
            'product_id',
            'product_id'
        );
    }
}
