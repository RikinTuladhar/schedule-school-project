<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeDescription extends Model
{
    protected $table = 'attribute_descriptions';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'attribute_id',
        'language_id',
        'name',
    ];

    protected $casts = [
        'attribute_id' => 'integer',
        'language_id' => 'integer',
    ];

    // Composite primary key
    protected function setKeysForSaveQuery($query)
    {
        $query->where('attribute_id', '=', $this->getAttribute('attribute_id'))
              ->where('language_id', '=', $this->getAttribute('language_id'));
        return $query;
    }

    // Relationships
    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id', 'attribute_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id', 'language_id');
    }
}
