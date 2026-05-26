<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeGroup extends Model
{
    protected $table = 'attribute_groups';
    protected $primaryKey = 'attribute_group_id';
    public $timestamps = false;

    protected $fillable = [
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // Relationships
    public function descriptions()
    {
        return $this->hasMany(AttributeGroupDescription::class, 'attribute_group_id', 'attribute_group_id');
    }

    public function description($languageId = 1)
    {
        return $this->hasOne(AttributeGroupDescription::class, 'attribute_group_id', 'attribute_group_id')
            ->where('language_id', $languageId);
    }

    public function attributes()
    {
        return $this->hasMany(Attribute::class, 'attribute_group_id', 'attribute_group_id');
    }
}
