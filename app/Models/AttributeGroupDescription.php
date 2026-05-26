<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeGroupDescription extends Model
{
    protected $table = 'attribute_group_descriptions';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'attribute_group_id',
        'language_id',
        'name',
    ];

    protected $casts = [
        'attribute_group_id' => 'integer',
        'language_id' => 'integer',
    ];

    // Composite primary key
    protected function setKeysForSaveQuery($query)
    {
        $query->where('attribute_group_id', '=', $this->getAttribute('attribute_group_id'))
              ->where('language_id', '=', $this->getAttribute('language_id'));
        return $query;
    }

    // Relationships
    public function attributeGroup()
    {
        return $this->belongsTo(AttributeGroup::class, 'attribute_group_id', 'attribute_group_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id', 'language_id');
    }
}
