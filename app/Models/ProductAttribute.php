<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    protected $table = 'product_attributes';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'attribute_id',
        'language_id',
        'text',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'attribute_id' => 'integer',
        'language_id' => 'integer',
    ];

    // Composite primary key
    protected function setKeysForSaveQuery($query)
    {
        $query->where('product_id', '=', $this->getAttribute('product_id'))
              ->where('attribute_id', '=', $this->getAttribute('attribute_id'))
              ->where('language_id', '=', $this->getAttribute('language_id'));
        return $query;
    }

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id', 'attribute_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id', 'language_id');
    }
}
