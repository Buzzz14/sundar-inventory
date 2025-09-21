import type { Category, Item } from "@/types";
import { api } from "../api";

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    getCategoryItems: builder.query<Item[], string>({
      query: (slug) => `/categories/${slug}/items`,
      providesTags: (_result, _error, slug) => [
        { type: "Item" as const, id: slug },
      ],
    }),

    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<Category, {slug:string; body: Partial<Category>}>( {
      query: ({ slug, ...body }) => ({
        url: `/categories/${slug}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/categories/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryItemsQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
