<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'category_id';

    protected $fillable = [
        'image',
        'parent_id',
        'top',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'top' => 'boolean',
        'sort_order' => 'integer',
        'status' => 'boolean',
    ];

    // Relationships
    public function descriptions()
    {
        return $this->hasMany(CategoryDescription::class, 'category_id', 'category_id');
    }

    public function description($languageId = 1)
    {
        return $this->hasOne(CategoryDescription::class, 'category_id', 'category_id')
            ->where('language_id', $languageId);
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id', 'category_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id', 'category_id');
    }

    public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'product_to_categories',
            'category_id',
            'product_id',
            'category_id',
            'product_id'
        );
    }
}
