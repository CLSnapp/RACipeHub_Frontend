import { api } from "../../app/api";

const recipesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query({
      query: () => ({
        url: "/recipes",
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getUserRecipes: builder.query({
      query: ({ userId }) => ({
        url: `/recipes/user/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getFavoriteRecipes: builder.query({
      query: ({ userId }) => ({
        url: `/recipes/favorites/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      providesTags: ["Recipe"],
    }),

    getCategories: builder.query({
      query: () => ({
        url: `/recipes/categories`,
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
    }),

    getIngredientUnits: builder.query({
      query: () => ({
        url: `/recipes/units`,
        method: "GET",
        transformResponse: (response) => response.data,
        transformErrorResponse: (response) => response.data.error,
      }),
    }),

    postRecipe: builder.mutation({
      query: (formData) => ({
        url: "/recipes/recipe",
        mode: "cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: formData,
      }),
      invalidatesTags: ["Recipe"],
    }),

    addFavoriteRecipe: builder.mutation({
      query: ({ recipeId, favorite }) => ({
        url: "/recipes/favorite",
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: {
          recipe: recipeId,
          favorite,
        },
      }),
      invalidatesTags: ["Recipe", "FavoriteRecipes"],
    }),

    updateRecipe: builder.mutation({
      query: ({ id, available }) => ({
        url: `/recipes/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ available }),

        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),

      invalidatesTags: ["Recipe"],
    }),

    removeCategoryFromRecipe: builder.mutation({
      query: ({ recipeId, categoryId }) => ({
        url: `/recipes/removecategory/${recipeId}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: { categories: categoryId },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),

      invalidatesTags: ["Recipe"],
    }),

    deleteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["Recipe"],
    }),

    deleteFavoriteRecipe: builder.mutation({
      query: ({ id }) => ({
        url: `/recipes/favorite/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        transformResponse: (response) => response.data.recipes,
        transformErrorResponse: (response) => response.data.error,
      }),
      invalidatesTags: ["Recipe", "FavoriteRecipes"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useUpdateRecipeMutation,
  usePostRecipeMutation,
  useAddFavoriteRecipeMutation,
  useDeleteRecipeMutation,
  useDeleteFavoriteRecipeMutation,
  useRemoveCategoryFromRecipeMutation,
  useGetFavoriteRecipesQuery,
  useGetUserRecipesQuery,
  useGetCategoriesQuery,
  useGetIngredientUnitsQuery,
} = recipesApi;
