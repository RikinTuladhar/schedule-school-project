<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDescription extends Model
{
    protected $table = 'product_descriptions';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'language_id',
        'name',
        'description',
        'tag',
        'meta_title',
        'meta_description',
        'meta_keyword',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'language_id' => 'integer',
    ];

    // Composite primary key
    protected function setKeysForSaveQuery($query)
    {
        $query->where('product_id', '=', $this->getAttribute('product_id'))
              ->where('language_id', '=', $this->getAttribute('language_id'));
        return $query;
    }

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id', 'language_id');
    }
}
