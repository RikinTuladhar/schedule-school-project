<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $table = 'languages';
    protected $primaryKey = 'language_id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'code',
        'locale',
        'image',
        'directory',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function categoryDescriptions()
    {
        return $this->hasMany(CategoryDescription::class, 'language_id', 'language_id');
    }

    public function productDescriptions()
    {
        return $this->hasMany(ProductDescription::class, 'language_id', 'language_id');
    }

    public function attributeDescriptions()
    {
        return $this->hasMany(AttributeDescription::class, 'language_id', 'language_id');
    }

    public function attributeGroupDescriptions()
    {
        return $this->hasMany(AttributeGroupDescription::class, 'language_id', 'language_id');
    }
}
