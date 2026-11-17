import axios from "axios";

export const deductCredits = async (userId, agent) => {
  const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
  try {
    const { data } = await axios.post(
      `${authServiceUrl}/deduct-credits`,
      { userId, agent },
      {
        headers: {
          "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
        },
        timeout: 10000,
      }
    );

    return data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Credit verification failed";
    console.error(`deductCredits failed for user ${userId}, agent ${agent}:`, message);

    const err = new Error(message);
    err.status = status;
    err.data = error.response?.data || { message };
    throw err;
  }
};

export const refundCredits = async (userId, agent) => {
  const authServiceUrl = process.env.AUTH_SERVICE || "http://localhost:8001";
  const AGENT_CREDIT_COSTS = {
    chat: 1,
    search: 5,
    coding: 10,
    pdf: 10,
    ppt: 10,
    vision: 10,
    image: 10,
    pdfRag: 10,
    imageAnalyzer: 5,
    orchestrator: 15,
  };
  const refundAmount = AGENT_CREDIT_COSTS[agent] || 1;

  try {
    await axios.post(
      `${authServiceUrl}/update-plan`,
      {
        userId,
        credits: refundAmount,
      },
      {
        headers: {
          "x-internal-service-key": process.env.INTERNAL_SERVICE_KEY || "",
        },
        timeout: 10000,
      }
    );
    console.log(`Refunded ${refundAmount} credits to user ${userId} for failed ${agent} task`);
  } catch (err) {
    console.error(`Failed to refund credits to user ${userId}:`, err.message);
  }
};
