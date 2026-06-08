import axiosInstance from "./axios";

export interface IssueSolution {
    id: string;
    content: string;
    isPinned: boolean;
    isAccepted: boolean;
    voteCount: number;
    createdAt: string;
    userId: string;
    user: {id: string, name: string};
}

export interface ProductIssue {
    id: string;
    title: string;
   description: string;
   status: "open"| "solved" | "closed";
   createdAt: string;
   user: {id: string, name: string};
   solutionCount: number;
   solutions?: IssueSolution[];

}

export interface QuickFix {
    id: string;
    content: string;
    issueTitle: string;
}

export const getProductIssues = async(productId: string): Promise<ProductIssue[]> => {
    const res = await axiosInstance.get(`/api/issues/products/${productId}`);
    return res.data.data;
}

export const getIssueDetail = async (issueId: string): Promise<ProductIssue> => {
    const res = await axiosInstance.get(`/api/issues/${issueId}`);
    return res.data.data;
}

export const getFixesBeforeReturn = async (productId: string): Promise<QuickFix[]> => {
    const res = await axiosInstance.get(`/api/issues/fixes/${productId}`);
    return res.data.data ?? [];
};

export const reportIssue = async (data: {
    productId: string; orderId?: string; title: string; description: string;

}): Promise<ProductIssue> => {
    const res = await axiosInstance.post("/api/issues", data);
    return res.data.datal
}

export const postSolution = async (solutionId: string, replyText: string): Promise<IssueSolution> => {
    const res = await axiosInstance.post(`/api/issues/solutions/${solutionId}/vote`);
    return res.data.data;
};

export const toggleVote = async (solutionId: string): Promise<IssueSolution> => {
    const res = await axiosInstance.post(`/api/issues/solutions/${solutionId}/vote`);
    return res.data.data;
};

export const pinSolution = async (solutionId: string): Promise<IssueSolution> => {
  const res = await axiosInstance.patch(`/api/issues/solutions/${solutionId}/pin`);
  return res.data.data;
};

export const acceptSolution = async (solutionId: string): Promise<IssueSolution> => {
  const res = await axiosInstance.patch(`/api/issues/solutions/${solutionId}/accept`);
  return res.data.data;
};
