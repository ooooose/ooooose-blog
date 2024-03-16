import { microcmsClient } from "../api/microcms";
import type { MicroCMSQueries } from "microcms-js-sdk";
import type { BlogsDetail, BlogsData } from "../types/microcmsTypes";

export const getAllBlogs = async (queries: MicroCMSQueries): Promise<BlogsData> => {
  return await microcmsClient
    .get({
      endpoint: "blog",
      queries,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.error(err));
};

export const getBlogsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
): Promise<BlogsDetail> => {
  return await microcmsClient
    .getListDetail({
      endpoint: "blog",
      contentId,
      queries,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.error(err));
};