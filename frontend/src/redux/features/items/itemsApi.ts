import type { Item } from "@/types";
import type { ItemFormValues } from "@/schemas/itemSchema";
import { api } from "../api";

export const itemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => "/items",
      providesTags: ["Item"],
    }),

    getItemBySlug: builder.query<Item, string>({
      query: (slug) => `/items/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Item", id: slug }],
    }),

    addItem: builder.mutation<Item, ItemFormValues | FormData>({
      query: (body) => ({
        url: "/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Item"],
    }),

    updateItem: builder.mutation<Item, { slug: string; body: ItemFormValues | FormData }>({
      query: ({ slug, body }) => ({
        url: `/items/${slug}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: "Item", id: slug },
        "Item",
      ],
    }),

    deleteItem: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/items/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Item"],
    }),

    getItemsByCategory: builder.query<Item[], string>({
      query: (categorySlug) => `/categories/${categorySlug}/items`,
      providesTags: (_result, _error, categorySlug) => [
        { type: "Item", id: categorySlug },
      ],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemBySlugQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetItemsByCategoryQuery,
} = itemApi;
