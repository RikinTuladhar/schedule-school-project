<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    protected $table = 'product_options';
    protected $primaryKey = 'product_option_id';
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'option_id',
        'value',
        'required',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'option_id' => 'integer',
        'required' => 'boolean',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function values()
    {
        return $this->hasMany(ProductOptionValue::class, 'product_option_id', 'product_option_id');
    }
}
