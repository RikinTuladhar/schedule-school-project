<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOptionValue extends Model
{
    protected $table = 'product_option_values';
    protected $primaryKey = 'product_option_value_id';
    public $timestamps = false;

    protected $fillable = [
        'product_option_id',
        'product_id',
        'option_id',
        'option_value_id',
        'quantity',
        'subtract',
        'price',
        'price_prefix',
        'points',
        'points_prefix',
        'weight',
        'weight_prefix',
    ];

    protected $casts = [
        'product_option_id' => 'integer',
        'product_id' => 'integer',
        'option_id' => 'integer',
        'option_value_id' => 'integer',
        'quantity' => 'integer',
        'subtract' => 'boolean',
        'price' => 'decimal:4',
        'points' => 'integer',
        'weight' => 'decimal:8',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function productOption()
    {
        return $this->belongsTo(ProductOption::class, 'product_option_id', 'product_option_id');
    }
}
