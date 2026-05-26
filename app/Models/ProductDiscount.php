<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDiscount extends Model
{
    protected $table = 'product_discounts';
    protected $primaryKey = 'product_discount_id';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'customer_group_id',
        'quantity',
        'priority',
        'price',
        'date_start',
        'date_end',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'customer_group_id' => 'integer',
        'quantity' => 'integer',
        'priority' => 'integer',
        'price' => 'decimal:4',
        'date_start' => 'date',
        'date_end' => 'date',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
