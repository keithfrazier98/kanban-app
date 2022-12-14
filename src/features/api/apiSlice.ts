import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/kbapi" }),
  tagTypes: ["Task", "Column", "Subtask", "Board"],
  endpoints: (builder) => ({
    // declare endpoints in API slice to conform TS requirement
    // injectEndpoints in seperate feature slices (see feature endpoint files)
  }),
});

export const { endpoints } = apiSlice;
