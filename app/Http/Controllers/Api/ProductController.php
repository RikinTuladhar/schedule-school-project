<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Models\Product;
use App\Models\ProductDescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductController extends BaseController
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        $languageId = $request->get('language_id', 1);
        $perPage = $request->get('per_page', 15);
        $categoryId = $request->get('category_id');

        $query = Product::with(['description' => function ($q) use ($languageId) {
            $q->where('language_id', $languageId);
        }, 'images'])
        ->where('status', 1);

        if ($categoryId) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }

        $products = $query->orderBy('sort_order')->paginate($perPage);

        return $this->sendResponse('Products retrieved successfully', $products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'model' => 'nullable|string|max:64',
            'sku' => 'nullable|string|max:64',
            'price' => 'required|numeric',
            'quantity' => 'integer',
            'status' => 'boolean',
            'descriptions' => 'required|array',
            'descriptions.*.language_id' => 'required|integer',
            'descriptions.*.name' => 'required|string|max:255',
            'descriptions.*.description' => 'nullable|string',
            'category_ids' => 'array',
            'category_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $product = Product::create(array_merge(
                $request->only([
                    'master_id', 'model', 'sku', 'upc', 'ean', 'jan', 'isbn', 'mpn',
                    'location', 'variant', 'override', 'quantity', 'stock_status_id',
                    'image', 'manufacturer_id', 'shipping', 'price', 'points',
                    'tax_class_id', 'date_available', 'weight', 'weight_class_id',
                    'length', 'width', 'height', 'length_class_id', 'subtract',
                    'minimum', 'rating', 'sort_order', 'status', 'lookbook_id'
                ]),
                [
                    'date_added' => now(),
                    'date_modified' => now(),
                ]
            ));

            foreach ($request->descriptions as $description) {
                ProductDescription::create([
                    'product_id' => $product->product_id,
                    'language_id' => $description['language_id'],
                    'name' => $description['name'],
                    'description' => $description['description'] ?? null,
                    'tag' => $description['tag'] ?? null,
                    'meta_title' => $description['meta_title'] ?? null,
                    'meta_description' => $description['meta_description'] ?? null,
                    'meta_keyword' => $description['meta_keyword'] ?? null,
                ]);
            }

            if ($request->has('category_ids')) {
                $product->categories()->attach($request->category_ids);
            }

            DB::commit();
            $product->load('descriptions', 'categories');

            return $this->sendResponse('Product created successfully', $product, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendErrorResponse('Failed to create product', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, $id)
    {
        $languageId = $request->get('language_id', 1);

        $product = Product::with([
            'description' => function ($query) use ($languageId) {
                $query->where('language_id', $languageId);
            },
            'categories.description' => function ($query) use ($languageId) {
                $query->where('language_id', $languageId);
            },
            'images',
            'discounts',
            'options.values',
            'attributes.attribute.description' => function ($query) use ($languageId) {
                $query->where('language_id', $languageId);
            }
        ])->find($id);

        if (!$product) {
            return $this->sendErrorResponse('Product not found', [], 404);
        }

        return $this->sendResponse('Product retrieved successfully', $product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->sendErrorResponse('Product not found', [], 404);
        }

        $validator = Validator::make($request->all(), [
            'model' => 'nullable|string|max:64',
            'sku' => 'nullable|string|max:64',
            'price' => 'numeric',
            'quantity' => 'integer',
            'status' => 'boolean',
            'descriptions' => 'array',
            'descriptions.*.language_id' => 'required|integer',
            'descriptions.*.name' => 'required|string|max:255',
            'category_ids' => 'array',
            'category_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return $this->sendErrorResponse('Validation Error', $validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $product->update(array_merge(
                $request->only([
                    'master_id', 'model', 'sku', 'upc', 'ean', 'jan', 'isbn', 'mpn',
                    'location', 'variant', 'override', 'quantity', 'stock_status_id',
                    'image', 'manufacturer_id', 'shipping', 'price', 'points',
                    'tax_class_id', 'date_available', 'weight', 'weight_class_id',
                    'length', 'width', 'height', 'length_class_id', 'subtract',
                    'minimum', 'rating', 'sort_order', 'status', 'lookbook_id'
                ]),
                ['date_modified' => now()]
            ));

            if ($request->has('descriptions')) {
                foreach ($request->descriptions as $description) {
                    ProductDescription::updateOrCreate(
                        [
                            'product_id' => $product->product_id,
                            'language_id' => $description['language_id']
                        ],
                        [
                            'name' => $description['name'],
                            'description' => $description['description'] ?? null,
                            'tag' => $description['tag'] ?? null,
                            'meta_title' => $description['meta_title'] ?? null,
                            'meta_description' => $description['meta_description'] ?? null,
                            'meta_keyword' => $description['meta_keyword'] ?? null,
                        ]
                    );
                }
            }

            if ($request->has('category_ids')) {
                $product->categories()->sync($request->category_ids);
            }

            DB::commit();
            $product->load('descriptions', 'categories');

            return $this->sendResponse('Product updated successfully', $product);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendErrorResponse('Failed to update product', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->sendErrorResponse('Product not found', [], 404);
        }

        try {
            $product->delete();
            return $this->sendResponse('Product deleted successfully');
        } catch (\Exception $e) {
            return $this->sendErrorResponse('Failed to delete product', ['error' => $e->getMessage()], 500);
        }
    }
}
