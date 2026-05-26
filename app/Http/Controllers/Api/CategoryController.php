<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Category;
use App\Models\CategoryDescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryController extends BaseController
{
    /**
     * Display a listing of categories.
     */
    public function index(Request $request)
    {
        $languageId = $request->get('language_id', 1);
        $perPage = $request->get('per_page', 15);

        $categories = Category::with(['description' => function ($query) use ($languageId) {
            $query->where('language_id', $languageId);
        }])
        ->where('status', 1)
        ->orderBy('sort_order')
        ->paginate($perPage);

        return $this->sendResponse('Categories retrieved successfully', $categories);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'parent_id' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'top' => 'boolean',
            'sort_order' => 'integer',
            'status' => 'boolean',
            'descriptions' => 'required|json',
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            // Create category first to get ID
            $category = Category::create([
                'parent_id' => $request->parent_id ?? 0,
                'image' => null, // Will update after file upload
                'top' => $request->top ?? false,
                'sort_order' => $request->sort_order ?? 0,
                'status' => $request->status ?? true,
            ]);

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $categoryDir = "categories/{$category->category_id}";
                $filename = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs($categoryDir, $filename, 'public');

                // Update category with image path
                $category->update(['image' => '/storage/' . $imagePath]);
            }

            // Parse descriptions JSON
            $descriptions = json_decode($request->descriptions, true);
            foreach ($descriptions as $description) {
                CategoryDescription::create([
                    'category_id' => $category->category_id,
                    'language_id' => $description['language_id'],
                    'name' => $description['name'],
                    'description' => $description['description'] ?? null,
                    'meta_title' => $description['meta_title'] ?? null,
                    'meta_description' => $description['meta_description'] ?? null,
                    'meta_keyword' => $description['meta_keyword'] ?? null,
                ]);
            }

            DB::commit();
            $category->load('descriptions');

            return $this->sendResponse('Category created successfully', $category, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendErrorResponse('Failed to create category', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified category.
     */
    public function show(Request $request, $id)
    {
        $languageId = $request->get('language_id', 1);

        $category = Category::with([
            'description' => function ($query) use ($languageId) {
                $query->where('language_id', $languageId);
            },
            'parent',
            'children'
        ])->find($id);

        if (!$category) {
            return $this->sendErrorResponse('Category not found', [], 404);
        }

        return $this->sendResponse('Category retrieved successfully', $category);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->sendErrorResponse('Category not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'parent_id' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'top' => 'boolean',
            'sort_order' => 'integer',
            'status' => 'boolean',
            'descriptions' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($category->image) {
                    $oldImagePath = str_replace('/storage/', '', $category->image);
                    \Storage::disk('public')->delete($oldImagePath);
                }

                $image = $request->file('image');
                $categoryDir = "categories/{$category->category_id}";
                $filename = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs($categoryDir, $filename, 'public');

                $category->update(['image' => '/storage/' . $imagePath]);
            }

            // Update other fields
            $category->update($request->only(['parent_id', 'top', 'sort_order', 'status']));

            // Parse and update descriptions if provided
            if ($request->has('descriptions')) {
                $descriptions = json_decode($request->descriptions, true);
                foreach ($descriptions as $description) {
                    CategoryDescription::updateOrCreate(
                        [
                            'category_id' => $category->category_id,
                            'language_id' => $description['language_id']
                        ],
                        [
                            'name' => $description['name'],
                            'description' => $description['description'] ?? null,
                            'meta_title' => $description['meta_title'] ?? null,
                            'meta_description' => $description['meta_description'] ?? null,
                            'meta_keyword' => $description['meta_keyword'] ?? null,
                        ]
                    );
                }
            }

            DB::commit();
            $category->load('descriptions');

            return $this->sendResponse('Category updated successfully', $category);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendErrorResponse('Failed to update category', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified category.
     */
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->sendErrorResponse('Category not found', [], 404);
        }

        try {
            $category->delete();
            return $this->sendResponse('Category deleted successfully');
        } catch (\Exception $e) {
            return $this->sendErrorResponse('Failed to delete category', ['error' => $e->getMessage()], 500);
        }
    }
}
