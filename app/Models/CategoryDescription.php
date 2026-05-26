<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryDescription extends Model
{
    protected $table = 'category_descriptions';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'category_id',
        'language_id',
        'name',
        'description',
        'meta_title',
        'meta_description',
        'meta_keyword',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'language_id' => 'integer',
    ];

    // Composite primary key
    protected function setKeysForSaveQuery($query)
    {
        $query->where('category_id', '=', $this->getAttribute('category_id'))
              ->where('language_id', '=', $this->getAttribute('language_id'));
        return $query;
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function language()
    {
        return $this->belongsTo(Language::class, 'language_id', 'language_id');
    }
}
