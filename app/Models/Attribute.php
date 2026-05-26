<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    protected $table = 'attributes';
    protected $primaryKey = 'attribute_id';
    public $timestamps = false;

    protected $fillable = [
        'attribute_group_id',
        'sort_order',
    ];

    protected $casts = [
        'attribute_group_id' => 'integer',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function group()
    {
        return $this->belongsTo(AttributeGroup::class, 'attribute_group_id', 'attribute_group_id');
    }

    public function descriptions()
    {
        return $this->hasMany(AttributeDescription::class, 'attribute_id', 'attribute_id');
    }

    public function description($languageId = 1)
    {
        return $this->hasOne(AttributeDescription::class, 'attribute_id', 'attribute_id')
            ->where('language_id', $languageId);
    }

    public function productAttributes()
    {
        return $this->hasMany(ProductAttribute::class, 'attribute_id', 'attribute_id');
    }
}
